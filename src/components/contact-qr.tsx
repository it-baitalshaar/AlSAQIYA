import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyShareUrl, downloadVCard } from "@/lib/company";

type ContactQrProps = {
  compact?: boolean;
};

export function ContactQr({ compact = false }: ContactQrProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const url = companyShareUrl();
    setShareUrl(url);
    const canvas = canvasRef.current;
    if (!canvas) return;

    void QRCode.toCanvas(canvas, url, {
      width: compact ? 200 : 256,
      margin: 2,
      color: { dark: "#1e2a4a", light: "#ffffff" },
      errorCorrectionLevel: "M",
    });
  }, [compact]);

  function downloadPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "Al-Saqiya-Trading-QR.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className={compact ? "flex flex-col items-center gap-4" : "flex flex-col items-center gap-5 sm:items-start"}>
      <div className="border border-border bg-white p-3 shadow-soft">
        <canvas ref={canvasRef} width={compact ? 200 : 256} height={compact ? 200 : 256} />
      </div>
      <div className={compact ? "text-center" : ""}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Scan to open our live contact card — phone, email, map, Instagram and Facebook stay
          current whenever we update the website.
        </p>
        {shareUrl ? (
          <p className="mt-2 break-all text-xs text-muted-foreground/80">{shareUrl}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
          <Button type="button" variant="gold" onClick={downloadPng}>
            <Download className="size-4" />
            Download QR
          </Button>
          <Button type="button" variant="quiet" onClick={downloadVCard}>
            <UserPlus className="size-4" />
            Save contact
          </Button>
        </div>
      </div>
    </div>
  );
}
