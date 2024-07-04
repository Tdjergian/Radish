import {awsPricingController} from('./awsPricingController')

function pricingUI () {
    console.log(awsPricingController)
    return (
        <div>
          <Greeting name="User" />
          <p>Welcome to my simple React app.</p>
        </div>
      );
}

module.exports = pricingUI