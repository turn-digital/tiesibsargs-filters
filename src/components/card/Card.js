function Card(props) {
  return (
    <div>
      {props.data?.map((card, index) => {
        return (
          <div
            className="card"
            style={{ border: "3px solid black" }}
            key={index}
          >
            <p className="date">
              {card.date} {card.category}
            </p>
            <p className="title">{card.title}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Card;
