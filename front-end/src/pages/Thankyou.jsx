function Thankyou() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-10">
      <div className="card-soft w-full p-8 text-center md:p-10">
        <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Hoàn tất</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-800">Cảm ơn bạn đã đặt lịch</h1>
        <p className="mt-3 text-slate-600">Yêu cầu của bạn đã được ghi nhận. Đội ngũ Garden Care sẽ liên hệ xác nhận trong thời gian sớm nhất.</p>
      </div>
    </div>
  );
}

export default Thankyou;