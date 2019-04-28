/*
	Allows to have `:active` state applied
	to buttons on mobile devices. This makes
	them more responsive.

	Disables scroll on outdated Safari 10 (IOS)
*/
document.addEventListener('touchmove', e => {
	e.preventDefault()
})