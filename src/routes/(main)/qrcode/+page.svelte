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

<div class="flex flex-col justify-center items-center">
    <h1 class="text-xl font-bold">
        Queuing QRCode
    </h1>
    <h4 class="text-md text-gray-200/80">
        Please turn up the screen lighting
    </h4>
    <img {src} alt="QRCode" class="h-80 w-80 p-2" />
</div>