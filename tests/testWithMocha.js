import fs from 'fs'; import puppeteer from 'puppeteer'; import { startFlow } from "lighthouse";
// const { startFlow } = pkg;
import { describe } from 'node:test';
import { expect } from 'chai';
// var expect = chai.expect
describe('Test for Cold Start', async function () {
    // const expect = require('chai').expect;   
    it('Sample Cold Start', async function () {
        const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-fullscreen'], }); const IdfcURL = 'https://uat-opt.idfcfirstbank.com/login'; 
        const submitButton = 'button[type="submit"]'; 
        const USER = { MOBILE: '9159548742', PASSWORD: 'Token@2023' }; 
        const page = await browser.newPage(); 
        const flow = await startFlow(page); 
        await flow.navigate(IdfcURL, { stepName: 'Cold Start' }); 
        await browser.close();
        //const report = await flow.generateReport();            
        // fs.writeFileSync('reports/flow_report10.html', report);            
        const jsonReportFile = await flow.createFlowResult()
        //fs.writeFileSync('jsonReport/flow-result1_2.json', JSON.stringify(jsonReportFile, null, 2));            
        // console.log(jsonReportFile.steps[0].lhr.audits["first-contentful-paint"].numericValue);            
        var fcp = jsonReportFile.steps[0].lhr.audits["first-contentful-paint"].numericValue; 
        var performanceScore = jsonReportFile.steps[0].lhr.categories.performance.score;
        console.log(performanceScore);
        expect(fcp).to.below(15000);
    });
});