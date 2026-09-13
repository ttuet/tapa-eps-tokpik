"use client";

import { useEffect, useId, useRef } from "react";

type PaywallModalProps = {
  onClose: () => void;
};

export function PaywallModal({ onClose }: PaywallModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const lessonDialog = document.querySelector<HTMLElement>("[data-lesson-dialog='true']");
    const hadInert = lessonDialog?.hasAttribute("inert");
    const previousOverflow = document.body.style.overflow;
    lessonDialog?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus();

    return () => {
      if (lessonDialog && !hadInert) lessonDialog.removeAttribute("inert");
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, []);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
    if (event.key === "Tab") event.preventDefault();
  }

  return (
    <div className="paywall-modal-backdrop">
      <div ref={dialogRef} className="paywall-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} onKeyDown={handleKeyDown}>
        <p className="paywall-kicker">TAPA PLUS</p>
        <h2 id={titleId}>Mở khóa lộ trình TAPA</h2>
        <p>Xem trước các quyền lợi của gói học: bài luyện mở rộng, ôn tập theo chủ đề và nhịp học cá nhân.</p>
        <ul><li>Bài luyện bổ sung cho từng chủ đề</li><li>Ôn tập ngắn theo tiến độ</li><li>Nội dung mới được sắp xếp rõ ràng</li></ul>
        <p className="paywall-note">Đây là màn hình thông tin; chưa có thao tác mua hoặc thanh toán.</p>
        <button type="button" onClick={onClose}>Đã hiểu</button>
      </div>
    </div>
  );
}
