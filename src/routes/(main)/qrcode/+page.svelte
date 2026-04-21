<script lang="ts">
    import QRCode from 'qrcode';

    let { data } = $props();

    let src = $state("");

    $effect(() => {
        const email = data.session?.user?.email ?? "Bad User";
        let cancelled = false;

        // TODO: Maybe add some encryption to the email to prevent impersonation
        QRCode.toDataURL(email)
            .then((url) => {
                if (!cancelled) src = url;
            })
            .catch(() => {
                if (!cancelled) src = "";
            });

        return () => {
            cancelled = true;
        };
    });
</script>

<section class="mx-auto flex min-h-[78svh] w-full max-w-xl flex-col items-center justify-center px-5 pb-12">
    <h1 class="text-center text-3xl font-black tracking-tight">Your Queue QR</h1>
    <p class="mt-2 text-center text-base text-base-content/75">Raise brightness for faster scanning</p>

    <div class="mt-6 w-full max-w-[24rem] rounded-3xl bg-white p-4 shadow-2xl">
        <img {src} alt="QRCode" class="h-auto w-full" />
    </div>
</section>
