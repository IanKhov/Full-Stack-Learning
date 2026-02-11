const Course = ({ course }) => {
  return (
    <div>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
    </div>

  )
}

const Content = ({ course }) => {
  return (
    <div>
        {course.parts.map(x => 
          <Part key={x.id} part={x.name} exercises={x.exercises}/>)}
    </div>
  )
} 

const Header = ({ course }) => {
  return (
    <>
      <h1>{course.name}</h1>
    </>
  )
}

const Total = ({ course }) => {
  const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)
  
  return (
    <>
      <p><strong>total of {total} exercises</strong></p>
    </>
  )
}

const Part = (props) => {
  return (
    <>
      <p>{props.part} {props.exercises}</p>
    </>
  )
}

export default Course