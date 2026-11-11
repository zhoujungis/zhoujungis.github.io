import sqlite3, tempfile, time, os

for mode, pragmas in [
    ("default (delete journal)", []),
    ("WAL", ["PRAGMA journal_mode=WAL"]),
]:
    p = tempfile.mktemp(suffix=".db")
    con = sqlite3.connect(p)
    for pr in pragmas:
        con.execute(pr)
    con.execute("CREATE TABLE t (i INTEGER, s TEXT)")
    con.commit()
    n = 2000
    t0 = time.perf_counter()
    for i in range(n):
        con.execute("INSERT INTO t VALUES (?, ?)", (i, "x" * 120))
        con.commit()
    dt = time.perf_counter() - t0
    print(f"{mode:26s} {n} commits: {dt:8.3f} s  -> {dt/n*1000:6.3f} ms/commit")
    con.close()
    for suf in ("", "-wal", "-shm"):
        try:
            os.remove(p + suf)
        except OSError:
            pass
