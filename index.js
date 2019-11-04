const puppeteer = require('puppeteer');

(async function pampa(){
  const browser = await puppeteer.launch({headless: false});
const page = await browser.newPage();
var categorie=[
  'https://www.amazon.fr/gp/search/other/ref=lp_13921051_sa_p_89?rh=n%3A13921051&bbn=13921051&pickerToList=lbr_brands_browse-bin&ie=UTF8&qid=1572890388',
  'https://www.amazon.fr/gp/search/other/ref=sr_in_-2_1?rh=i%3Acomputers%2Cn%3A340858031&bbn=340858031&pickerToList=lbr_brands_browse-bin&ie=UTF8&qid=1572890968'
]

var resultat=[],lettre;
for(let y =0;y<categorie.length;y++){
  for(let i=0;i<27;i++){
    (i==0)?(lettre = '%23'):lettre =String.fromCharCode(96+i);
    await page.goto(categorie[y]+'&indexField='+lettre,{waitUntil: 'networkidle0'});
    const data = await page.$$eval('.a-list-item', pp => pp.map(p=>[p.querySelector('.refinementLink').innerText,Number((p.querySelector('.narrowValue').innerText).replace(/(\s)|(\))|(\()/g,''))]));
    const all = await data.filter(function(item) {
      if (item[1] >= 1000){
          return item 
      }
    });
    resultat = resultat.concat(all);
  }
}
console.log(resultat)
})()