<script lang="ts">
  export let theme: string = 'white';
  export let doorRow = 2;
  const roof: Record<string,string> = { white:'#d84b3f', yellow:'#e6b52e', green:'#3c9b55', blue:'#3477cf', black:'#4b5668' };
  const roofDark: Record<string,string> = { white:'#9e352f', yellow:'#b57f1e', green:'#286a3b', blue:'#25528f', black:'#303947' };
  $: c = roof[theme] ?? roof.white;
  $: d = roofDark[theme] ?? roofDark.white;
</script>
<svg viewBox="0 0 108 108" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="image-rendering:pixelated">
  <rect x="18" y="36" width="72" height="55" fill="#efe3bd" stroke="#4b3829" stroke-width="3"/>
  <path d="M10 38L20 18h68l10 20-7 7H17z" fill={c} stroke="#4b3829" stroke-width="3"/>
  <path d="M18 35h72" stroke={d} stroke-width="4"/>
  <path d="M22 24h64M19 30h70" stroke="#f4d77d" stroke-width="2" opacity=".45"/>
  <g stroke="#4b3829" stroke-width="2">
    <rect x="27" y="48" width="20" height="15" fill="#63b9dc"/><path d="M37 48v15M27 55h20"/>
    <rect x="61" y="48" width="20" height="15" fill="#63b9dc"/><path d="M71 48v15M61 55h20"/>
  </g>
  <rect x="48" y="65" width="14" height="26" fill="#9b6137" stroke="#4b3829" stroke-width="2"/>
  <rect x="57" y="77" width="2" height="2" fill="#f1d278"/>
  <rect x="43" y="91" width="24" height="5" fill="#c5aa7b" stroke="#4b3829" stroke-width="2"/>
  <g fill="#58a94e" stroke="#35783c" stroke-width="1"><circle cx="25" cy="84" r="5"/><circle cx="83" cy="84" r="5"/></g>
  <g fill="#f3e6d0"><rect x="22" y="80" width="3" height="3"/><rect x="81" y="82" width="3" height="3"/></g>
</svg>
