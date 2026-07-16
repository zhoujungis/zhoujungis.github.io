<template>
  <div class="share-buttons">
    <span class="share-label">分享：</span>
    <button class="share-btn wechat" title="微信" @click="shareWechat">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.136 0 .241-.11.241-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.49.49 0 0 1 .178-.554C23.028 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122zm-2.18 2.769c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z"/></svg>
    </button>
    <button class="share-btn weibo" title="微博" @click="shareWeibo">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zm-7.317-6.781c-1.059-.2-1.911.419-1.903 1.383.008.964.87 1.907 1.93 2.107 1.058.2 1.91-.419 1.903-1.383-.008-.964-.87-1.907-1.93-2.107zm2.13 3.68c-.563-.249-.754-.766-.428-1.153.326-.388 1.019-.523 1.58-.275.56.248.753.764.429 1.153-.326.386-1.018.524-1.581.275zm.992-3.808c-2.07-.028-4.538.537-7.344 2.641C-.405 17.1-.279 19.15.35 20.49c.528 1.123 1.494 1.773 2.43 2.144 4.878 1.935 10.857.606 13.679-1.35 2.934-2.035 4.033-4.771 3.157-7.165-.516-1.405-1.797-2.398-3.31-2.882l.06-.05c2.485-2.08 4.213-4.585 4.213-7.146 0-5.213-7.11-7.735-10.966-5.371-1.742 1.07-2.772 2.788-3.064 4.72.422-.12.865-.197 1.323-.23 3.271-.241 7.273.776 7.273 3.86 0 3.502-3.823 4.667-6.721 4.667-.89 0-1.785-.215-2.595-.598z"/></svg>
    </button>
    <button class="share-btn twitter" title="Twitter" @click="shareTwitter">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    </button>
    <button class="share-btn copy" title="复制链接" @click="copyLink">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
    </button>
    <span v-if="copied" class="copy-feedback">已复制</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  url: { type: String, default: '' },
})

const copied = ref(false)

function shareWeibo() {
  const u = encodeURIComponent(props.url || window.location.href)
  const t = encodeURIComponent(props.title)
  // noopener,noreferrer prevents the opened window from accessing
  // window.opener (tabnabbing) and from leaking our URL as Referer.
  window.open(
    `https://service.weibo.com/share/share.php?url=${u}&title=${t}`,
    '_blank',
    'noopener,noreferrer,width=600,height=400',
  )
}

function shareTwitter() {
  const u = encodeURIComponent(props.url || window.location.href)
  const t = encodeURIComponent(props.title)
  window.open(
    `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    '_blank',
    'noopener,noreferrer,width=600,height=400',
  )
}

function shareWechat() {
  // WeChat has no web share API — the best we can do is show a tip
  alert('请复制链接后在微信中粘贴发送')
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.url || window.location.href)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // fallback
    const ta = document.createElement('textarea')
    ta.value = props.url || window.location.href
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.share-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.share-label {
  font-size: 0.82rem;
  color: $text-secondary;
}

.share-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1px solid $glass-border;
  background: rgba(255,255,255,0.04);
  color: $text-secondary;
  cursor: pointer;
  transition: color $transition-fast, background $transition-fast, border-color $transition-fast;

  &:hover { border-color: rgba(255,255,255,0.15); }
  &.wechat:hover { color: #07c160; background: rgba(7,193,96,0.1); border-color: rgba(7,193,96,0.3); }
  &.weibo:hover { color: #e6162d; background: rgba(230,22,45,0.1); border-color: rgba(230,22,45,0.3); }
  &.twitter:hover { color: #1da1f2; background: rgba(29,161,242,0.1); border-color: rgba(29,161,242,0.3); }
  &.copy:hover { color: $neon-cyan; background: rgba(0,229,255,0.1); border-color: rgba(0,229,255,0.3); }
}

.copy-feedback {
  font-size: 0.78rem;
  color: #00e676;
}
</style>
