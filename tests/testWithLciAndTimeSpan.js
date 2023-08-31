const { default: puppeteer } = require("puppeteer");
const { startFlow } = require("lighthouse");
//const desktopConfig = require("lighthouse/lighthouse-core/config/desktop-config.js");
// import puppeteer from "puppeteer";
// import { startFlow } from "lighthouse";


let counter = 1;


async function doLogin(page) {
    const IdfcURL = 'https://app.pt-opt.idfcfirstbank.com/login';
    const submitButton = 'button[type="submit"]';
    const USER = {
        MOBILE: '9894224825',
        PASSWORD: 'Idfc@2023'
};

    const flow = await startFlow(page, {name: 'IDFC First Bank'});
     

    await flow.navigate(IdfcURL, {stepName: 'Cold Start'});

    await flow.navigate(IdfcURL, {
        stepName: 'Warm Start',
        configContext: {
            settingsOverrides: { disableStorageReset: true},
        },
    });
     await flow.snapshot({stepName: "Login"});

     //Login enter mobile number
     await flow.startTimespan({stepName: "Login-Mobile Number"});
     const inputMobileNumber = await page.$('input[data-testid="phone-number-id"]');

     await inputMobileNumber.type(USER.MOBILE);
     await page.click(submitButton);
     await page.waitForNavigation();
     await flow.endTimespan();

     //Login - Enter Password

     await flow.startTimespan({stepName:"Login - Enter Password"});
     const inputPassword = await page.$('input[name="login-password-input"]');
     await inputPassword.type(USER.PASSWORD);
     await page.click(submitButton);
      await page.waitForNavigation({waitUntil: ["load","networkidle2"]});

     await flow.endTimespan();

     await flow.startTimespan({stepName:"Landed on Dashboard"});
     await flow.endTimespan();


    console.log(`Login is successful`)
}

async function setup(browser, context) {
    // launch browser for LHCI
    console.log('Entered setup block', counter);
     browser = await puppeteer.launch({headless: false, slowMo: 50});

     page = await browser.newPage();
    await page.setCacheEnabled(true)
    //console.log("context url",context.url);
    if(counter===1){
        await doLogin(page)
    }
    
    // close session for next run
    await browser.close();

      counter++;
}
setup();
module.exports = setup
// export default setup;