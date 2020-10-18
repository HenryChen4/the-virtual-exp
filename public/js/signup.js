const getData = (query)=>{
    const dataJSON = localStorage.getItem(query)
    if(dataJSON !== null){
        return JSON.parse(dataJSON)
    } else {
        return []
    }
}

const createNewUser = (data)=>{
    localStorage.setItem('users', data)
}

const sendError = (msg)=>{
    const errorEl = document.createElement('div')
    errorEl.classList.add('alert', 'alert-warning')
    errorEl.textContent = msg
    document.querySelector('#error-field').appendChild(errorEl)
}

document.querySelector('#sign-up').addEventListener('submit', (e)=>{
    document.querySelector('#error').innerHTML = ''
    e.preventDefault()
    let users = getData('users')
    let inputtedEmail = document.querySelector('#email').value
    let inputtedPassword = document.querySelector('#password').value
    let inputtedGrade = document.querySelector('#grade-input').options[document.querySelector('#grade-input').selectedIndex].text
    let newUser = {
        email: inputtedEmail,
        password: inputtedPassword,
        grade: inputtedGrade
    }

    const found = users.find((user)=>{
        return user.email === inputtedEmail
    })
    if(found === undefined){
        users.push(newUser)
        createNewUser(users)
        window.location.href = "/login"
    } else {
        sendError('Email already taken')
    }
})