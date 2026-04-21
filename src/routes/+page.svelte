<script lang="ts">
    let { data } = $props();
</script>

<section class="mx-auto flex min-h-[74svh] w-full max-w-xl items-center px-5 pb-10">
    <div class="w-full rounded-3xl border border-base-300 bg-base-200/85 p-7 shadow-xl sm:p-8">
        <p class="mb-2 text-sm tracking-[0.2em] text-base-content/60 uppercase">Queue Pass</p>
        <h1 class="text-4xl font-black leading-tight sm:text-5xl">QR Code Generator</h1>

        <a href="/qrcode" class="btn btn-primary btn-lg btn-block mt-7 text-base">Open QR Code</a>

        {#if data.session?.user?.email}
            <p class="mt-5 truncate text-center text-sm text-base-content/70">{data.session.user.email}</p>
        {:else}
            <p class="mt-5 text-center text-sm text-base-content/70">Sign in to generate your QR code</p>
        {/if}
    </div>
</section>
