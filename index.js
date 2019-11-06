const puppeteer = require('puppeteer');
const ora = require('ora');


//function qui se lance automatiquement (function name(){})()
(async function pampa(){

//lancement de la page
const browser = await puppeteer.launch();
const page = await browser.newPage();
//Pour ajouter un lien dans 'categorie' il suffit d'aller dans une catégorie amazon de sélectionner 'Voir plus' dans 'Marque' et de récupérer le lien. 
//!Attention! Par défault 'affichage' est sélectionner sur 'Meilleures marques' et doit le rester pour que cela fonctionne.
var categorie=[
  'https://www.amazon.fr/gp/search/other/ref=lp_13921051_sa_p_89?rh=n%3A13921051&bbn=13921051&pickerToList=lbr_brands_browse-bin&ie=UTF8&qid=1572892457',
  'https://www.amazon.fr/gp/search/other/ref=lp_13921051_sa_p_89?rh=n%3A13921051&bbn=13921051&pickerToList=lbr_brands_browse-bin&ie=UTF8&qid=1572892457'
]
var blacklist=['Atari'];
const spinner = ora('Start').start();
var resultat=[],lettre;
for(let y =0;y<categorie.length;y++){
  for(let i=0;i<7;i++){
    //si i ==0 lettre var être égale à '%23' se qui correspond à '#' et après lettre va être égale à 'a' puis 'b' ...
    lettre= i==0 ? '%23' : String.fromCharCode(96+i);
    spinner.text= `Lien:${y+1}/${categorie.length} lettre:${lettre}`
    //ajoute de '&indexField='+lettre qui nous permet de changer de page avec les différente lettres
    await page.goto(categorie[y]+'&indexField='+lettre,{waitUntil: 'networkidle0'});
    //$$eval nous permet de selectioner tout les items donc un item contient le nom de la marque et le nombre de produit
    //QuerySelector va nour permmettre de récupérer le nom et le nombre de l'item
    const data = await page.$$eval('.a-list-item', pp => pp.map(p=>[p.querySelector('.refinementLink').innerText,Number((p.querySelector('.narrowValue').innerText).replace(/(\s)|(\))|(\()/g,''))]));
    //La function filter nous permet de sélectionner que les marques qui ont plus de 1000 produit (sur l'exemple) 
    const all = await data.filter(function(item) {
      if (item[1] >= 1000 && !blacklist.includes(item[0])){
          return item 
      }
    });
    resultat = resultat.concat(all);
  }
}
console.log(resultat)
})()