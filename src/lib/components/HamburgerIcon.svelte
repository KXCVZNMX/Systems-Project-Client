<script lang="ts">
    let { open } = $props<{ open: boolean }>();
</script>

<button
    class="btn btn-square btn-lg bg-base-200 shadow-2xl"
    aria-label={open ? "Close menu" : "Open menu"}
>
    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none">
        {#if open}
            <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
            />
        {:else}
            <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
            />
        {/if}
    </svg>
</button>
