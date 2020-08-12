var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
const puppeteer = require('puppeteer');
var i = 0;
var url = "https://www.csdn.net/";//初始url

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send(); fetchPage(url)
});

module.exports = router;
var delay = 1000;
async function fetchPage(x) {
  const brower = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/TSBrowser/TSBrowser.exe',   //指定chromium浏览器位置;
    headless: false,  //默认为true 表示不打开浏览器展示;
  })

  // 等待时间
  function timeout(delay) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(1)
        } catch (e) {
          reject(0)
        }
      }, delay)
    })
  }


  // 文件追加
  function wFs(data) {
    fs.appendFile('./performanceTesting.txt', data, 'utf8', function (err, ret) { })
  }
  const page = await brower.newPage()
  page.setViewport({ width: 1920, height: 1080 })
  await page.tracing.start({ path: 'trace.json' });
  // 创建一个文件
  let fd = fs.openSync('performanceTesting.txt', 'w');
  fs.writeFileSync(fd, new Date() + ";登入csdn页面\n");
  await page.setDefaultNavigationTimeout(0);
  // 进入地址
  await page.goto(url, {
    waitUntil: 'domcontentloaded'
  });
  wFs(new Date() + ";结束登入\n")

  await page.click('a[title=博客]')
  wFs(new Date() + ";进入博客\n")
  await page.waitForSelector('.clearfix').then(() => { })
  wFs(new Date() + ";登入博客成功\n")

  wFs(new Date() + ";开始导出页面数据\n")
  const titleList = await page.evaluate(() => {
    let post = [...document.querySelectorAll('.clearfix .list_con .title h2 a')];
    let postTemp = [];
    post.map((a) => {
      postTemp.push({
        label: a.innerText,
        url: a.href
      })
    });
    return postTemp
  })

  let fdd = fs.openSync('atxt.json', 'w')
  fs.writeFileSync(fdd, JSON.stringify(titleList))
  wFs(new Date() + ";导出页面数据结束\n")

  await page.tracing.stop();
}
