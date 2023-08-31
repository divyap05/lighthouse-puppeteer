import fs from 'fs';
import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import {startFlow, desktopConfig} from "lighthouse";

(async() => {
    const browser =  await puppeteer.launch(
        {
            headless: false,
            defaultViewport: null,
            args:['--start-fullscreen'],
        }
    );
    const IdfcURL = 'https://qa-opt.idfcfirstbank.com/login';
    const submitButton = 'button[type="submit"]';
    const USER = {
        MOBILE: '9159548742',
        PASSWORD: 'Idfc@2024'
};

    const page = await browser.newPage();

    const flow = await startFlow(page, {config: desktopConfig, flags:{screenEmulation:{disabled:true}}});
     await page.setViewport({width:1920,height:1080});

    await flow.navigate(IdfcURL);

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

    
     await flow.startTimespan({stepName:"Navigate to Accounts"});
    //  const popupClose = await page.$('button[data-testid="skipPopup"]');
    //  await page.click(popupClose);
     await page.waitForSelector('span[data-testid="Accounts"]');
     await page.click('span[data-testid="Accounts"]');
    //  await page.waitForNavigation({waitUntil: ["load","networkidle2"]});
    await flow.endTimespan();
    await flow.snapshot({stepName: "Account Page"});



      await browser.close();

    const report = await flow.generateReport();
    fs.writeFileSync('reports/flow_report12.html', report);

    const jsonReportFile = await flow.createFlowResult()
    
    fs.writeFileSync('jsonReport/flow-result12.json', JSON.stringify(jsonReportFile, null, 2));

    console.log(jsonReportFile.steps[0].lhr.audits["first-contentful-paint"].numericValue);



})();