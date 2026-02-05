const Hello = (props) => {
	console.log(props)
	return (
		<div>
			<p>Hello {props.name}, you are {props.age} years old</p>
		</div>
	)
}

const App = () => {
	const now = new Date()
	const a = 10
	const b = 20
	const name = "Cam"
	console.log(now, a+b)

	const friends = [
		{name: 'Bob', age: 67},
		{name: 'Ward', age: 21}
	]
	
	return (
		<>
			<h1>Greetings</h1>
			<p>it is {now.toString()}</p>
			<Hello name="George" age="?"/>
			<Hello name="Ian" age={26 + 15}/>
			<Hello name={name} age={a + b}/>
			<p>
				{a} plus {b} is equal to {a + b}
			</p>

			<p>{friends[0].name} {friends[0].age}</p>
			<p>{friends[1].name} {friends[1].age}</p>
		</>
	)
}

export default App