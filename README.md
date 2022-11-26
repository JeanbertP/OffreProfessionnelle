# DiagFluxPro
Project inspired of a original application made by me in my company to help business advisor to calculate product fees.
Product, prices, images, links to product sheet are obviously modified

This project show some behaviours 
 - Material Table usage
 - The table is dynamically made with lines which are configurated with json files
 - Différent line's behaviour according definition in json
    - Autoselectable line (ie the product is always selected and cannot be unselected)
    - Calculation depending on another line :
      - master/slave products
        When you select a master product, the slave products inherit of periodicyty and price
        For example, MobileBank Product 8 and MobileBank Product 7 are linked
        For example, Monetics product 1 and Monetics product 2 & 3
        For example, Monetics product 11 and Monetics product 11.1 and Monetics product 11.2
      - period slave of master period (of another product)
        When you select the reduction (discount) of a master product, the slave products inherit of its reduction and price      
        For example, "Reduction" for "MobileBank Product 9" values are copied on "MobileBank Product 10" and "MobileBank Product 10"  
      - According value of a periodicity, the value of the tarif column is displayed by an input field or a listbox
        For example
  - pdf generation
  - load/save function
  - async load of huge parameter file (list of banking agency) (voluntarily limited to 3 address... smaller therfore...). It is involved in the address' agency for the advisor.
    Chosen in the 2nd tab and displayed in the 3rd tab 

This project was generated with Angular version 13.3.6.


## Detail for the first tab
This tab is a help to formalize the customer's choices via interview line by line
There are 2 parts to the In and OUT flux 
In each parts, there are some sub-tabs (described in encaissementcategories.json, paiementcategories.json)
  - encaissementcategories.json : ["Credit Cards", "Cash", "Trading effects", "Transfers/Withdrawals", "Checks"]
  - paiementcategories.json : [ "Credit Cards", "Trading effects", "Transfers", "Withdrawals"]

### General case to display a tab, whatever the tab and sub-tab
  For a line, there are colums (equivalent of the json elements) : 
    categ: product category
    situation: situation (face to face, remote, ...)
    besoin: question to asked to the client to target his need
    solution: the product meeting the need
    aide: filename with the help about product
    url: url to the pdf describing the product 
    modeop: modus operandi to set the product


## Detail for the second tab
There are 3 param files wich describe description products by category (baq, bad, mop)
Some fields are specialized for products but aoverall they are identical


### General case : The choice in the Reduction listbox sets the calculation of the associated price
  For a line : The price is calculated by taking the value of "tarifTab" at the index of the choice in "reductionTab". The result (value of tarifTab[indice de reductionTab]) is copied in "tarifReel" 
  It's the same behaviour for the calculation of the delegation level.

## Detail for the product's fields
{
    "categorie":"XXX"  <= Category for the product
    "selectable": true/false, <= displays or not the selection checkbox 
    "autoselectedpdt": true/false,  <= Product is autoselect or not (cannot be unselected, always put in the basket) 
    "pdtassocies": [], <= List of the slave product. It allows to add/remove then according the master's choice
    "pdt": "", <= Product's text
    "periodicite": "", <= Product's périodicity
    "tarif": "", <= Product's default price
    "saisielibre": true/false, <= indicates if the price can be entered even if ther is a primary dépendancy to the reduction and price
    "outils": [  <= For some products, it allows to display help on the selected product
        {
            "nom": "",
            "url": ""
        }, ...
    ],
    "reductionTab": [  <= Available reduction array to associate to the "tarifTab" et "tarifReel" fields
                       <= one of the values can be "Free entry" ; it's used in the management of paticular cases (see following paragraphs)
    ],
    "autoselectedreduction": true/false, <= calculated field that allows to know if the listbox msut be displayed according that the reduction depends on another (the master). This field is not important, it's to speed up treatment.
    "reductionsassociees": [ <= Tableau des produits dont la réduction est associée 
    ],
    "delegataireTab": [], <= Delegates level : according the discount choice, an advisor could be ask a confirmation to a level-up advisor
    "tarifTab": [], <= available price array
    "delegataire": "", <= real (calculated) delegate (resulting of the index of delegataireTab[index of reductionTab])
    "tarifreel": "" <= real (calculated) price (resulting of the index of tarifTab[index of reductionTab])
}

### Linked prodcuts : the master is selectable, the slaves are dependant on its sélection
  => The "selectable" attribute is set to true for the master product 
  => The "selectable" attribute is set to false for the slave products; it involved hiding the selection checkbox
  => When the master product is selected/unselected, we iterate on the slave ones to add/remove them from the basket

### Management of price field 
  Normally, price field's value is depending on others fields' choice.
  In some cases, when you choose "Free entry" or "RFS" (if available obviously !) in the "Reduction" listbox, the price field has to valued via an input field (ex: corrective or free price)
  To do that, the "saisielibre" is set to true in the product's json description 

### Reduction group :
  In some cases, the reduction value has to be identicall for several products; and de facto, prices also.
  The master product has a "reductionsassociees" attribute, which contains the names of products whose the pricing is depending on.
  The associated products hav an "autoselectedreduction" attribute set to true, that allows to hide the listbox with reduction choice.
  So, When you choose the value in the reduction listbox of the master product, the program iterates on the product (whose the reduction is linked) and copies the associated value for chosen redcution and price. 
  Technically, for instance, if the index=4 for the choice in the master product's listbox, we iterate on each linked product and we set the value reduction[4] for the reduction et tarif[4] for the price. Caution ! We don't get the value in the master line (exactly the json entry) BUT the values in the associated lines for the SAME index.

### Specific case for the bundled discount package : 
  For some products, the discount has to be identical but it could be a "free entry" choice that it also dissociates prices
  So, When you select/deselect the "free entry" value; if yes, a input field for "tarif" is displayed for each linked products.
  Tecchnically, the "autoselectedreductiondependance" field is set to true. As is, int the Proposal tab, the reductions and prices are displayed for each product 


## Detail for the third tab
It's just a clean display of the choices made in the second tab.
THe major technical insterests is the cutting in several A4 pages to print and the pdf transformation
