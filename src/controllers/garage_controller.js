import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['carList', 'form']

  connect() {
    console.log("hello from garage controller!")
    this.url = 'https://wagon-garage-api.herokuapp.com/route66/cars'
    this._refreshCars()
  }

  createCar(event) {
    event.preventDefault()
    const formData = new FormData(this.formTarget)
    const newCar = Object.fromEntries(formData)

    fetch(this.url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newCar)
    })
      .then(() => {
        this._refreshCars()
        this.formTarget.reset()
      })
  }

  destroy({params}) {
    console.log(`remover o carro ${params.id}`)
    fetch(`https://wagon-garage-api.herokuapp.com/cars/${params.id}`, {
      method: 'DELETE'
    })
      .then(() => {
        this._refreshCars()
      })
  }

  _refreshCars() {
    fetch(this.url)
      .then( response => response.json() )
      .then((data) => {
        this.carListTarget.innerHTML = ''
        data.forEach((car) => {
          this._insertCar(car)
        })
      })
  }

  _insertCar(car) {
    const html = `
      <div class="car">
      <div class="car-image">
        <img src="http://loremflickr.com/280/280/${car.brand} ${car.model}" />
      </div>
      <div class="car-info">
        <h4>${car.brand} ${car.model}</h4>
        <p><strong>Owner:</strong> ${car.owner}</p>
        <p><strong>Plate:</strong> ${car.plate}</p>
        <button class='btn btn-danger' data-action='click->garage#destroy' data-garage-id-param='${car.id}'>Remove</button>
      </div>
    </div>`

    this.carListTarget.insertAdjacentHTML('beforeend', html)
  }

}
