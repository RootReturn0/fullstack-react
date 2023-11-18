const Header = (props) => {
    return (
        <div>
            <h2>{props.course}</h2>
        </div>
    )
}

const Part = (props) => {
    return (
        <div>
            <p>
                {props.part} {props.exercises}
            </p>
        </div>
    )
}

const Content = (props) => {
    return (
        <div>
            {props.parts.map(p => (
                <Part key={p.id} part={p.name} exercises={p.exercises} />
            ))}
        </div>
    )
}

const Total = (props) => {
    const total = props.parts.reduce((s, p) => s + p.exercises, 0)
    return (
        <div>
            <p>
                <b>Total of {total} exercises</b>
            </p>
        </div>
    )
}

const Course = (props) => {
    return (
        <div>
            <Header course={props.course.name} />
            <Content parts={props.course.parts} />
            <Total parts={props.course.parts} />
        </div>
    )
}

export default Course