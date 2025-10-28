interface ProductContentProps {
  item: TranslatedNewsItem;
  onClick: (item: TranslatedNewsItem) => void;
}
const ProductContent = ({ item, onClick }: ProductContentProps) => {
  const handleOpenModal = () => onClick(item);

  return (
    <div
      className="relative group h-80 w-full overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-2xl cursor-pointer"
      onClick={handleOpenModal}
    >
      <img
        src={item.img}
        alt={item.title}
        className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full p-6 text-white">
        <h3 className="text-2xl font-bold transition-transform duration-300 group-hover:-translate-y-2">
          {item.title}
        </h3>
      </div>
    </div>
  );
};

export default ProductContent;
