// <ProductCard /> - drop-in product card for Mystoq storefronts.
// https://mystoq.com

export function ProductCard({ product, onAdd, currency = "DZD" }) {
  const price = (product.price / 100).toLocaleString("en-DZ", { maximumFractionDigits: 2 });
  return (
    <article className="mq-card">
      <div className="mq-card-img">
        {product.image_url
          ? <img src={product.image_url} alt={product.name} loading="lazy" />
          : <div className="mq-card-placeholder" />}
      </div>
      <div className="mq-card-body">
        <h3 className="mq-card-name">{product.name}</h3>
        <div className="mq-card-row">
          <span className="mq-card-price">{price} <small>{currency}</small></span>
          <button
            className="mq-card-btn"
            onClick={() => onAdd?.(product)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "نفد" : "أضف للسلة"}
          </button>
        </div>
      </div>
    </article>
  );
}
