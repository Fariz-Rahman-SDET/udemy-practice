import * as XLSX from 'xlsx';
import {test} from '@playwright/test'

test('excel Practice',async({})=>{

    const workbook = XLSX.readFile('dataFileSheet/Playwright_TestData.xlsx');
    const workSheet = workbook.Sheets['TestData'];
    const data = XLSX.utils.sheet_to_json(workSheet);
    console.log(data[0].Name)
})