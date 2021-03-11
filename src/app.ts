import express from 'express';
import puppeteer, { Browser, HTTPResponse } from 'puppeteer';
import http from 'http';

const port = process.env.PORT || 3003
const app = express();
const server = http.createServer(app);

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

const itemURLs: string[] = [
    'https://shopee.vn/%C4%90i%E1%BB%87n-tho%E1%BA%A1i-Iphone-5-5s-5se-qu%E1%BB%91c-t%E1%BA%BF-H%C3%A0ng-ph%C3%A2n-ph%E1%BB%91i-ch%C3%ADnh-th%E1%BB%A9c-i.188863065.7215928405',
    'https://shopee.vn/%C4%90i%E1%BB%87n-tho%E1%BA%A1i-Vsmart-Star-4-(3GB-32GB)-H%C3%A0ng-Ch%C3%ADnh-H%C3%A3ng-i.125786401.5347928267',
    'https://shopee.vn/Gh%E1%BA%BF-%C4%91%E1%BB%87m-eames-tam-gi%C3%A1c-nh%E1%BA%ADp-kh%E1%BA%A9u-(-gh03-)-i.105430748.7419962431',
    'https://shopee.vn/%C3%81o-ng%E1%BB%B1c-Just-Bra-d%C3%A1ng-croptop-n%C4%83ng-%C4%91%E1%BB%99ng-c%C3%B3-m%C3%BAt-m%E1%BB%8Fng-AB250-i.118344697.7449154067',
    'https://shopee.vn/B%C3%A0n-ph%C3%ADm-laptop-Samsung-NC108-NC110-BH-12-th%C3%A1ng-i.18728662.4365629140',
    'https://shopee.vn/%C3%A1o-thun-tay-d%C3%A0i-th%E1%BB%9Di-trang-ph%C3%B4ng-r%E1%BB%99ng-m%C3%A0u-r%E1%BA%AFn-i.396579855.8523498487',
    'https://shopee.vn/%C3%A1o-hoa-qu%E1%BA%A3-pijamas-%C4%91i-bi%E1%BB%83n-hawaii-ch%E1%BB%A5p-k%E1%BB%B7-y%E1%BA%BFu-Ch%E1%BA%A5t-KATE-TH%C3%81I-Lo%E1%BA%A1i-1(-%E1%BA%A2nh-Shop)-Gi%C3%A1-R%E1%BA%BB-H%C3%B4m-Nay-i.138140686.5740272512',
    'https://shopee.vn/M%C3%A0n-h%C3%ACnh-laptop-ASUS-TP550-K550-K552-K533-K56-N51-A550-X501-X502-X550-U50-X52-BH-12-TH%C3%81NG-NEW-15.6-inch-40p-slim-i.18728662.4554695076',
    'https://shopee.vn/D%C3%A2y-c%C3%A1p-s%E1%BA%A1c-cho-iPhone-4-D%C3%A2y-c%C3%A1p-s%E1%BA%A1c-cho-iPhone-4s-i.18728662.5466967061',
    'https://shopee.vn/(-GI%C3%81-C%E1%BB%ACA-H%C3%80NG)-B%C3%A0n-ph%C3%ADm-Laptop-Asus-F555-X555-K555-TP550-X555-X555L-X555Y-A555L-F555L-K555L-X555L-W509-W519-VM510-i.18728662.6149878755',
    'https://shopee.vn/Fan-qu%E1%BA%A1t-t%E1%BA%A3n-nhi%E1%BB%87t-CPU-laptop-Dell-Inpiron-15-7560-7572-Vostro-5468-5568-V5468-V5568-i.18728662.7767773836',
    'https://shopee.vn/B%C3%A0n-ph%C3%ADm-laptop-Dell-Vostro-3350-3450-3550-3555-1440-1445-1450-1550-2420-13Z-N311Z-(-ZiN)-i.18728662.3251270711',
    'https://shopee.vn/%C3%81o-Croptop-YAN-Tay-D%C3%A0i-N%E1%BB%AF-1hitshop-i.71861331.4535287199',
    'https://shopee.vn/%C3%81o-PLO-CROPTOP-TR%C6%A0N-TT12-i.14889238.4432701756',
    'https://shopee.vn/%C3%81o-SINCE-m%E1%BA%AFt-bo-g%E1%BA%A5u-TH567-i.7782867.5759029261',
    'https://shopee.vn/%C3%81o-s%C6%A1-mi-n%E1%BB%AF-d%C3%A0i-tay-TR%C6%A0N-Basic-Unisex-D%C3%A1ng-R%E1%BB%99ng-Tr%E1%BA%AFng-v%C3%A0-%C4%90en-Ki%E1%BB%83u-%C3%A1o-s%C6%A1-mi-n%E1%BB%AF-tay-d%C3%A0i-form-r%E1%BB%99ng-su%C3%B4ng-Leevin-Store-i.218712444.3925678907',
    'https://shopee.vn/%C4%90i%E1%BB%87n-tho%E1%BA%A1i-OPPO-A3s-3G-32GB-Fullbox-B%E1%BA%A3o-h%C3%A0nh-12-th%C3%A1ng-nh%E1%BA%ADp-kh%E1%BA%A9u-i.87493314.2824763150',
    'https://shopee.vn/%C4%90i%E1%BB%87n-tho%E1%BA%A1i-Smartphone-Forme-R7-(-A77-)-Ram-1GB-Rom-8GB-M%E1%BB%9Bi-nguy%C3%AAn-seal-H%C3%A0ng-ch%C3%ADnh-h%C3%A3ng-i.27662376.6037315729',
    'https://shopee.vn/%C4%90i%E1%BB%87n-Tho%E1%BA%A1i-Iphone-12-Pro-Max-128GB-ch%C3%ADnh-h%C3%A3ng-nguy%C3%AAn-seal-b%E1%BA%A3n-QT-ch%C6%B0a-k%C3%ADch-ho%E1%BA%A1t-i.291705732.8500663029',
    'https://shopee.vn/Ron-%C4%91%E1%BB%87m-c%E1%BB%ADa-ch%E1%BA%B7n-khe-c%E1%BB%ADa-ch%E1%BB%91ng-c%C3%B4n-tr%C3%B9ng-ti%E1%BA%BFng-%E1%BB%93n-gi%C3%B3-l%C3%B9a-gi%C3%B3-%C4%91i%E1%BB%81u-h%C3%B2a-b%E1%BB%A5i-b%E1%BA%A9n-tr%C3%A1nh-k%E1%BA%B9t-ch%C3%A2n-i.160305556.3445239019',
    'https://shopee.vn/V%C3%AD-Nam-YORN-Da-Th%E1%BA%ADt-100-Si%C3%AAu-B%E1%BB%81n-Ph%E1%BB%91i-M%C3%A0u-Tinh-t%E1%BA%BF-K%C3%A8m-h%E1%BB%99p-B%E1%BA%A3o-H%C3%A0nh-1-N%C4%83m-i.160305556.3552607886',
    'https://shopee.vn/Gh%E1%BA%BF-g%E1%BA%A5p-g%E1%BB%8Dn-du-l%E1%BB%8Bch-d%C3%A3-ngo%E1%BA%A1i-gh%E1%BA%BF-x%E1%BA%BFp-mini-c%C3%A2u-c%C3%A1-si%C3%AAu-ti%E1%BB%87n-d%E1%BB%A5ng-m%C3%A0u-X%C3%81M-i.190165803.6536785868',
    'https://shopee.vn/G%C4%83ng-tay-t%E1%BA%ADp-GYM-%C4%91i-ph%C6%B0%E1%BB%A3t-b%E1%BA%A3o-v%E1%BB%87-c%E1%BB%95-tay-v%C3%A0-kh%E1%BB%9Bp-ng%C3%B3n-tay-H%C3%A0ng-ch%C3%ADnh-h%C3%A3ng-i.160305556.3620944691'
];

const getItem = async (browser: Browser, url: string) =>{
    const page = await browser.newPage();

    page.on('response', async (resp: HTTPResponse) => {
        const url: string = resp.url();
        // console.log('url:', url);
        if (url.includes("item/get")){
            console.log('url:', url);

            try {
            let responseBody = await resp.json();
            // console.log('body:', responseBody)
            console.log('name:', responseBody.item.name)
            }
            catch(e) {
                console.log('err', e);
            }
        }
    })
  
    // let's navigate to the dev.to homepage
    // await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url);

    await sleep(1500);
    await page.close()
}

const getItems = async (urls: string[]) => {
    const browser = await puppeteer.launch();
    for(let i = 0; i < urls.length; i++){
        await getItem(browser, urls[i])
        
    }
    
    await browser.close();
}

const sleep = (ms: number) => {
    return new Promise((resolve, _reject) => {
        setTimeout(() => {
            resolve(true);
        }, ms);
    });
}

getItems(itemURLs);

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     page.on('response', async (resp: HTTPResponse) => {
//         const url: string = resp.url();
//         // console.log('url:', url);
//         if (url.includes("item/get")){
//             let responseBody = await resp.json();
//             console.log('url:', url, 'body:', responseBody)
//         }
//     })
  
//     // let's navigate to the dev.to homepage
//     await page.setViewport({ width: 1920, height: 1080 });
//     await page.goto('https://shopee.vn/%C4%90i%E1%BB%87n-tho%E1%BA%A1i-Iphone-5-5s-5se-qu%E1%BB%91c-t%E1%BA%BF-H%C3%A0ng-ph%C3%A2n-ph%E1%BB%91i-ch%C3%ADnh-th%E1%BB%A9c-i.188863065.7215928405');
    
//     await page.close()
//     await browser.close();
//   })();