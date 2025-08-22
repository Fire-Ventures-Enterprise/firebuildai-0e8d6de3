export const CompanyInfo = () => {
  return (
    <div className="w-1/3 p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          FB
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">FIREBUILD.AI</h2>
          <p className="text-gray-600 font-medium">CONSTRUCTION</p>
        </div>
      </div>
      <div className="text-gray-600 space-y-1 text-sm">
        <p>29 Birchbank Crescent</p>
        <p>Kanata, ontario</p>
        <p>K2M 2J9</p>
        <p>Canada</p>
        <p>firebuildai@gmail.com</p>
      </div>
    </div>
  );
};