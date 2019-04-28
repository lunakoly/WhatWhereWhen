/**
* When the roulette starts spinning
* it's initial rotation speed is set
* to this value
*/
const INITIAL_SPEED = 69
/**
* When the roulette is above an arrow
* it going to get one more little push
* to move to the next cell. This is the
* speed it'll be given for that
*/
const SHIFT_SPEED = 0.11
/**
* The roulette spinner `is not moving` if
* it's speed if < STOP_SPEED_MARK
*/
const STOP_SPEED_MARK = 0.00005
/**
* The roulette spinner speed is decreased
* by that value every seconod
*/
const SPEED_DECREMENT = 1.07

/**
* Current speed of rulette spinner
* It gets decreased automatically inside
* of `requestAnimationFrame()`
*/
let rollSpeed = 0
/**
* This value represents the angle of the
* roulette spinner and can be used to determine
* the sector it's pointing to
*/
let rollAngle = 0
/**
* When spinner stops (it's speed is < STOP_SPEED_MARK)
* the we should update the information about which
* sector is selected. If he have already done that before
* then we should not update info twice. This flag is true
* if we have already updated info
*/
let isResultDefined = true
/**
* The number of the sector the spinner is
* pointing to (1..12). `-1` is the initial value
* which means 'no sector selected'
*/
let winningSector = -1
/**
* It'll store references to every envelop on the field.
* Envelop 1 can be addressed as `envelopes["1"]`
*/
let envelopes = {}
/**
* The number of shown envelopes
*/
let activeEnvelopesLeft = 12
/**
* Stores content of all tasks. Task 1's data can be accessed
* via `tasks["1"]`
*/
let tasks = {}


/**
* Attempts to define the new `winningSector`.
* If the spinner points to an arrow, it'll give
* it some extra speed to move to the next cell
*/
function defineResult() {
	// do nothing if there're no more envelopes
	if (activeEnvelopesLeft == 0)
		return

	let newSector = Math.floor(rollAngle / 30) + 1

	// only true if the envelop we're pointing to is hidden
	// (has already been openeds)
	if (envelopes[newSector].style.display == 'none') {
		rollSpeed += SHIFT_SPEED
		return
	}

	winningSector = Math.floor(rollAngle / 30) + 1
	isResultDefined = true

	// roll is the button that triggers the
	// spinner and during the spinning it
	// has been disabled (roll.className = 'disabled').
	// so, reenable it back
	roll.className = ''

	// iterate envelops and set them proper normal colors
	recolorEnvelopes()
}

/**
* Ensures that all envelops are of the correct colors
*/
function recolorEnvelopes() {
	// for each envelop inside `envelops`
	for (let each of Object.values(envelopes)) {
		// `rouletteIndex` is the number of the sector
		// the envelope is in
		if (each.rouletteIndex == winningSector)
			each.className = 'selected envelope'
		else
			each.className = 'envelope'
	}
}

/**
* Moves the hidden task tab down so that
* the user can see it and sets up it's
* text, question, answer (`result`) and cover image.
*
* `number` - the number of some task
*/
function showTask(number) {
	// If no cover provided, `error` event will
	// be fired for `cover` and `display` will
	// be set to `none` (hidden). But if we are successful it'll
	// continue to be `block` (shown)
	cover.style.display = 'block'

	// if data is not provided for the current task
	// the following code will cause errors.
	// if code inside `try` causes errors then
	// `catch` will execute.
	try {
		// set path to cover image
		cover.src 			= 'covers/' + tasks[number].cover
		// contents of text, question and result
		question.innerHTML 	= tasks[number].question
		result.innerHTML 	= tasks[number].result
		text.innerHTML 		= tasks[number].text

		// move task from `too above` (top = '-200%')
		// to the center of the screen
		task.style.top = '50%'
		// result should be hidden by default
		// (it's className is not 'shown')
		result.className = ''
	} catch (e) {
		alert('This task has not been completed yet!')
	}
}


// generates envelopes and puts
// them into the field
for (let it = 0; it < 12; it++) {
	let envelope = document.createElement('div')
	envelope.className = 'envelope'

	// rotating an envelope around the roulette
	// center allows to set it's sector (visually)
	let angle = 15 + it * 30
	angle = angle % 360

	envelope.style.transform = 'translate3d(-50%, -350%, 0) rotateZ(' + angle + 'deg)'

	// put it above other children of roulette
	// so that they will not hide it with themselves
	roulette.insertBefore(envelope, roulette.firstChild)

	// add custom `rouletteIndex` attribute to each envelope
	// so that we could know what sector each envelope belongs to
	envelope.rouletteIndex = it + 1
	envelopes[envelope.rouletteIndex] = envelope

	// when we click on this envelope
	envelope.addEventListener('click', e => {
		// if it's sector is the winning one
		if (envelope.rouletteIndex == winningSector)
			showTask(envelope.rouletteIndex)
	})
}


// press the button to make the spinner spin
roll.addEventListener('click', e => {
	if (roll.className != 'disabled') {
		roll.className = 'disabled'
		isResultDefined = false
		rollSpeed = INITIAL_SPEED + Math.random() * 30
	}
})

// when we click the button to show the answer
answer.addEventListener('click', e => {
	result.className = 'shown'
})

// wen we close the task (hide it)
hide.addEventListener('click', e => {
	// too far to be able to see the task banner
	task.style.top = '-200%'
	result.className = ''

	// if there is some sector that has been selected
	if (winningSector != -1) {
		// hide it's envelope
		envelopes[winningSector].style.display = 'none'
		activeEnvelopesLeft--
	}
})

// if no cover provied for `cover` it'll
// fire an error event here.
// just hide the cover element at all!
cover.addEventListener('error', e => {
	cover.style.display = 'none'
})


// origin time point needed for animations
let oldTime = new Date().getTime()

// it's a loop
requestAnimationFrame(function repeat() {
	// get time point of `now`
	let newTime = new Date().getTime()
	let deltaTime = newTime - oldTime
	oldTime = newTime

	// delta time is needed for animations to
	// run with proper speed

	rollAngle += rollSpeed * deltaTime
	rollAngle = rollAngle % 360

	// decrease spee
	rollSpeed /= SPEED_DECREMENT

	// set viaual rotation for the spinner
	spinner.style.transform = 'translate3d(-50%, -87.5%, 0) rotateZ(' + rollAngle +'deg)'

	// we need to update info about the selected sector
	if (!isResultDefined && rollSpeed < STOP_SPEED_MARK)
		defineResult()

	// repeat the above again (loop it)
	requestAnimationFrame(repeat)
})