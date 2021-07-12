function Menu(props) {
    return (
        <div
            id={props.id}
            className={`menu${!!props.hidden ? ' hidden' : ''}`}
        >
            {props.content.map((item, i) => (
                <div
                    className='menu-item'
                    key={i}
                >
                    {item}
                </div>
            ))}
        </div>
    )
}

export default Menu;