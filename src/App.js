import React, { Component } from 'react'
import Header from './components/ui/Header/Header'
import BookList from './BookList'

const url = 'https://www.forverkliga.se/JavaScript/api/crud.php?'
let qsGet = '&op=select'
let qsSet = '&op=insert'
//const apiKey = localStorage.setItem('Api-Key', 'smGkX')
//const key = localStorage.getItem('apiKey')
//const constKey = 'key=smGkX'



class App extends Component {

  

  constructor(props) {
    super(props)
    this.state = { title: '', author: '', bookList: [] , apiKey: localStorage.getItem('apiKey')}
    

    this.fillBookList = this.fillBookList.bind(this)
    this.submitHandler = this.submitHandler.bind(this)

  }
/*
  setKey() {
    localStorage.setItem('apiKey', 'smGkX')
  }
*/
  requestApiKey = async () => {
    
    const key = localStorage.getItem('apiKey')
    if (key) {
      return key
    } else {
      try {
        return await fetch(`${url}requestKey`)
          .then(response => response.json())
          .then(result => {
            console.log(result)
            localStorage.setItem('apiKey', result.key)
            return result.key})
  
        
        
      } catch (err) {
        return err
      }
    }
  }

 

  submitHandler(e) {
    e.preventDefault()
    const key = localStorage.getItem('apiKey')
    if (key) {
      this.request(`key=${this.state.apiKey}op=insert&title=${this.state.title}&author=${this.state.author}`, function (data) {
      })
    } else {
      function getApiKey(key) { this.request(url + `requestKey`, function (data) { }) }
    }
    fetch(url + 'key='+ this.state.apiKey + qsSet + `&title=${this.state.title}&author=${this.state.author}`)
      .then(function (response) { return response.json() })
      .then((data) => {
        if (data.status === 'success') {
          this.setState({ bookList: [...this.state.bookList, { id: data.id, title: this.state.title, author: this.state.author }] })
        }
        else {
          
        }
      })
  }


  fillBookList(props) {
    console.log(props)
    this.setState({
      bookList: props
    })
  }

  async request(qsGet, cb, limit = 10) {
    const key = await this.requestApiKey()
    console.log(key)
    fetch(url + `key=` + key + qsGet).then(function (response) { return response.json() }).then(({ data }) => {
      console.log(data)
      if (data) {
        if (cb) {
          cb(data)
          console.log(data)
        }
      } else if (limit > 0) {
        this.request(qsGet, cb, limit - 1)
      } else {
        console.log(data.message)
      }
    })
  }
  
    
  
  componentDidUpdate() {
    console.log(this.state.bookList)
  }

  componentDidMount() {
   
    this.request(qsGet, this.fillBookList)

  }
  titleChange = (e) => this.setState({ title: e.target.value })


  authorChange = (e) => this.setState({ author: e.target.value })


  render() {
    return (
      <div className="App">
        <Header />
        <div className="container">
          <div className="row form-section">
            <form className="book-form col-6">
              <legend>Lägg till dina favoritböcker</legend>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  aria-describedby="title"
                  placeholder="Lägg till titel"
                  value={this.state.title}
                  onChange={this.titleChange}
                />
                <input
                  type="text"
                  className="form-control"
                  id="author"
                  rows="3"
                  data-gramm="true"
                  data-txt_gramm_id="63b74fb6-c7e4-7f0e-0c1f-438d47ac87a0"
                  data-gramm_id="63b74fb6-c7e4-7f0e-0c1f-438d47ac87a0"
                  data-gramm_editor="true"
                  placeholder="Lägg till författare"
                  value={this.state.author}
                  onChange={this.authorChange}

                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                id='storeBookBtn'
                onClick={this.submitHandler}
              >
                Skicka
              </button>
              
            </form>
          </div>
        </div>
        {console.log(this.state)}
        <BookList bok={this.state.bookList} />
      </div>
    )
  }
}

export default App
