import "./Card.css";

// eslint-disable-next-line react/prop-types
function Card({ image, name, college }) {
  return (
    <div className="card-content">
      <div className="card-image">
        <img src={image} alt={`${name}'s image`} />
      </div>
      <div className="card-info">
        <h3>{name}</h3>
        <p>{college}</p>
      </div>
    </div>
  );
}

export default Card;
