export default function AppLogo() {
    return (
        <>
            <img
                src="/assets/logo.png"
                alt="PC Handover"
                className="size-11 shrink-0 object-contain group-data-[collapsible=icon]/sidebar-wrapper:size-9"
            />
            <div className="ml-3 grid flex-1 text-left group-data-[collapsible=icon]:hidden">
                <span className="truncate text-base leading-tight font-semibold tracking-tight text-sidebar-foreground">
                    PC Handover
                </span>
            </div>
        </>
    );
}
