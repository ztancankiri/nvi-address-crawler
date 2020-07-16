const axios = require('axios');
const cheerio = require('cheerio');

async function getTokens() {
    const response = await axios.get('https://adres.nvi.gov.tr/VatandasIslemleri/AdresSorgu');
    const $ = cheerio.load(response.data);
    const headerToken = $('input[name="__RequestVerificationToken"]').attr('value');

    let cookies = response.headers['set-cookie'];
    let cookie = null;

    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].includes('__RequestVerificationToken')) {
            cookie = cookies[i];
            break;
        }
    }

    if (cookie !== null) {
        cookie = cookie.split(';')[0].split('=')[1];
    }
    else {
        console.log('Cookie is not found!');
        return null;
    }

    return [headerToken, cookie];
}

async function getIller(headerToken, cookieToken) {
    const il_response = await axios.post('https://adres.nvi.gov.tr/Harita/ilListesi', '', {
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "__RequestVerificationToken": headerToken,
            "Referer": "https://adres.nvi.gov.tr/VatandasIslemleri/AdresSorgu",
            "Cookie": "__RequestVerificationToken=" + cookieToken
        }
    });

    return il_response.data;
}

async function getIlceler(headerToken, cookieToken, ilKimlikNo) {
    const ilce_response = await axios.post('https://adres.nvi.gov.tr/Harita/ilceListesi', 'ilKimlikNo=' + ilKimlikNo, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
            "__RequestVerificationToken": headerToken,
            "Referer": "https://adres.nvi.gov.tr/VatandasIslemleri/AdresSorgu",
            "Cookie": "__RequestVerificationToken=" + cookieToken
        }
    });

    return ilce_response.data;
}

async function getMahalleler(headerToken, cookieToken, ilceKimlikNo) {
    const ilce_response = await axios.post('https://adres.nvi.gov.tr/Harita/mahalleKoyBaglisiListesi', 'ilceKimlikNo=' + ilceKimlikNo, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
            "__RequestVerificationToken": headerToken,
            "Referer": "https://adres.nvi.gov.tr/VatandasIslemleri/AdresSorgu",
            "Cookie": "__RequestVerificationToken=" + cookieToken
        }
    });

    return ilce_response.data;
}

async function getSokaklar(headerToken, cookieToken, mahalleKoyBaglisiKimlikNo) {
    const ilce_response = await axios.post('https://adres.nvi.gov.tr/Harita/yolListesi', 'mahalleKoyBaglisiKimlikNo=' + mahalleKoyBaglisiKimlikNo, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
            "__RequestVerificationToken": headerToken,
            "Referer": "https://adres.nvi.gov.tr/VatandasIslemleri/AdresSorgu",
            "Cookie": "__RequestVerificationToken=" + cookieToken
        }
    });

    return ilce_response.data;
}

async function main() {
    const tokens = await getTokens();

    if (tokens !== null) {
        const iller = await getIller(tokens[0], tokens[1]);
        const ilceler = await getIlceler(tokens[0], tokens[1], '06');
        const mahalleler = await getMahalleler(tokens[0], tokens[1], '1872');
        const sokaklar = await getSokaklar(tokens[0], tokens[1], '10311');

        console.log(iller);
    }
}

main();