"""Benchmark: message-delivery reliability across pipeline modes.

Simulates a producer -> broker -> consumer pipeline with random network loss,
a broker crash mid-run, and consumer crashes, comparing:

  A. fire-and-forget   (no publisher confirm, non-persistent, auto-ack)
  B. partial           (publisher confirm + persistent, auto-ack)
  C. full reliability  (confirm + persistent + manual ack + idempotent consumer)

Also compares fixed-interval vs exponential-backoff retry while the consumer
is down for a fixed outage window.

Pure stdlib, deterministic (seeded). Run: python tools/bench_mq_delivery.py
"""

import random

random.seed(42)

N = 100_000
NETWORK_LOSS = 0.001          # p(message dropped on producer -> broker)
CONSUMER_CRASH = 0.005        # p(consumer dies mid-processing a message)
BROKER_CRASH_AT = N // 2      # broker dies once, half-way through the run


def simulate(mode):
    """Return (delivered, lost, duplicates, extra_sends)."""
    delivered = lost = duplicates = extra_sends = 0
    inflight = []               # messages at the broker (ids)
    seen = set()                # consumer-side dedup store (idempotency)
    for mid in range(N):
        # --- producer -> broker hop ---
        send = 1
        while random.random() < NETWORK_LOSS:
            # message lost in flight
            if mode in ("partial", "full"):   # publisher confirm -> retry
                extra_sends += 1
                send += 1
                continue
            break                             # fire-and-forget: gone forever
        if random.random() < NETWORK_LOSS and mode == "fire-and-forget":
            lost += 1
            continue
        # (simplify: after confirm-retries, message reaches the broker)
        # --- broker hop ---
        if mid == BROKER_CRASH_AT:
            if mode == "fire-and-forget":
                lost += len(inflight)         # in-memory queue wiped
                inflight = []
            # persistent brokers reload from disk -> inflight survives
        inflight.append(mid)
        # --- consumer hop (single in-flight consumer) ---
        while inflight:
            msg = inflight[0]
            if mode in ("fire-and-forget", "partial"):
                inflight.pop(0)               # auto-ack: removed before work
                if random.random() < CONSUMER_CRASH:
                    lost += 1                 # died mid-processing, gone
                else:
                    delivered += 1
            else:                             # manual ack
                if random.random() < CONSUMER_CRASH:
                    # crash before ack -> redelivery, eventual completion
                    duplicates += 1 if msg in seen else 0
                    seen.add(msg)
                    delivered += 1
                    inflight.pop(0)
                else:
                    seen.add(msg)
                    delivered += 1
                    inflight.pop(0)
    return delivered, lost, duplicates, extra_sends


for mode in ("fire-and-forget", "partial", "full"):
    delivered, lost, dup, extra = simulate(mode)
    print(
        f"{mode:16s} delivered={delivered:6d}  lost={lost:6d}  "
        f"duplicates={dup:6d}  extra_sends={extra:6d}"
    )


# --- retry backoff: consumer down for 10 s, then recovers ---
OUTAGE = 10.0

def retry_cost(strategy):
    attempts = t = 0
    interval = 0.1
    while t < OUTAGE:
        attempts += 1
        t += interval
        if strategy == "expo":
            interval = min(interval * 2, 5.0)
    return attempts

print(f"\nconsumer outage {OUTAGE:.0f}s -> wasted retries: "
      f"fixed100ms={retry_cost('fixed')}  exponential={retry_cost('expo')}")
