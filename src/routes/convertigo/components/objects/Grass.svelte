<script lang="ts">
  export let variant = 0;
</script>

<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect width="36" height="36" fill={variant % 2 ? '#79bd55' : '#72b84f'}/>
  <g fill="#5caa49">
    <path d="M4 9l2-4 1 5zM15 30l2-5 1 6zM29 10l2-4 1 5zM24 24l2-4 1 5z"/>
  </g>
  <g fill="#9dce63">
    <rect x="8" y="16" width="2" height="2"/><rect x="19" y="7" width="2" height="2"/>
    <rect x="31" y="27" width="2" height="2"/><rect x="4" y="28" width="2" height="2"/>
  </g>
  {#if variant === 1}
    <g fill="#e9e6cf"><rect x="11" y="11" width="2" height="2"/><rect x="13" y="9" width="2" height="2"/><rect x="13" y="11" width="2" height="2"/></g>
  {/if}
</svg>
