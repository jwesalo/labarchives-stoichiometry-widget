
# LabArchives "Stoichmeister" Stoichiometry Table Widget
![Aspirin](https://github.com/jwesalo/labarchives-stoichiometry-widget/blob/images/aspirin.png)
This widget calculates and documents amounts, moles, volumes, and stoichiometric equivalents for chemical reactions.

The widget can be added to a LabArchives Notebook page.

To use the widget:
 1. Plan the reaction. Type the expected amount of the limiting reagent into row 1 (e.g., "100 mg" if you expect to do a reaction on that scale). FW and/or density values will allow it to calculate the moles automatically. Then, type in all of the other reagents, their stoichiometry (equiv.), and their FW/density, and the amount you need to add will be automatically calculated.
 2. When weighing out the reagents, input the actual amount used. For the limiting reagent in row 1, check the "Locked" box before changing so that the amounts of the reagents in the rows below will not change. When to box is checked, changing the amount in row 1 results in only the equiv. in the rows below changing.
 
 If desired, yield can be calculated by creating an additional row for the product, and typing in the amount and FW. % Yield can then be calculated as 100 × equiv.

The following changes have been made from the original:
 - Added a "locked" checkbox for the first row. When unchecked, changes to amount or volume in row 1 cause recalculation of amount, moles, equiv., and volume in the rows below. When checked, only equiv. will change in the rows below.
 - Changed fonts
 - Adjusted column widths (main goal was to ensure that the equiv. column shows 2 decimal places for % yield calculations and for catalysts) 
 - Increased maximum length of substance names to 120 characters.

Bryan Andrews and Joshua Wesalo (University of Pittsburgh) forked the code from the original developed by the [Sydney Informatics Hub](https://informatics.sydney.edu.au) from an initial version by [Dr. Samuel Banister](https://sydney.edu.au/science/people/samuel.banister.php). This work was completed to build a customized widget for the Deiters Lab (http://deiterslab.org). This work was supported by the US National Institutes of Health (R01GM112728).

## How to use the widget in your notebook

To install, you will need to copy the contents from [`widget.html`](https://github.com/jwesalo/labarchives-stoichiometry-widget/raw/master/widget.html) and [`script.js`](https://github.com/jwesalo/labarchives-stoichiometry-widget/raw/master/script.js) into the [Widget Manager](https://labarchives.kayako.com/Knowledgebase/Article/View/409/0/5031-the-widget-manager).

1. Go to the *Widget Manager*
![Widget Manager](https://github.com/jwesalo/labarchives-stoichiometry-widget/blob/images/Widget_manager.png)
2. Under *Available Widgets* click *New*
3. Enter the widget title: *Stoichiomeister* (or *Stoich Table*, or whatever you choose to call it for your notebooks)
4. In the *Widget HTML Editor* tab, click the *Source* button on the toolbar.
5. In a new browser window:
    1. Go to https://github.com/jwesalo/labarchives-stoichiometry-widget/raw/master/widget.html
    2. *Select All*
    3. *Copy*
6. Back in your *Widget HTML Editor*: *Select All* and *Paste*.
![HTML](https://github.com/jwesalo/labarchives-stoichiometry-widget/blob/images/HTML.png)
7. Change to the *Script Editor* tab.
8. In a new browser window:
    1. Go to https://github.com/jwesalo/labarchives-stoichiometry-widget/raw/master/script.js
    2. *Select All*
    3. *Copy*
9. Back in your *Script Editor*: *Select All* and *Paste*
![JS](https://github.com/jwesalo/labarchives-stoichiometry-widget/blob/images/JS.png
10. Click the *Save Widget* button next to the Title entry box.

## Insert the widget into a page of your notebook

Click to insert a widget (may be under the "More" menu).
![insert](https://github.com/jwesalo/labarchives-stoichiometry-widget/blob/images/insert.png)
Select the Widget you've created, and click "Use Stoich Table" or whatever you called it.
![select](https://github.com/jwesalo/labarchives-stoichiometry-widget/blob/images/insert2.png)

See https://labarchives.kayako.com/knowledgebase/article/View/408/286/501-what-are-widgets

## Expected Behaviour

The software requirements detail expected behaviour for each modification to the table's data.

The permitted user inputs to the Stochiometry widget and the subsequent results are documented for the following 
two scenarios - 

1. When first entering data into the table
2. When changing the values of the experiment


### Initializing the records of the experiment:

On launching the Stochiometry widget to add to the page, only row 1 will be enabled on entry, 
although subsequent rows will be displayed.

For row 1 initial entry, the permitted ways of entering values are tabulated below - 

|  User Enters  | Automatically Calculated |
| ------------- | ------------- |
| amt then fw  | moles  |
| fw then amt  | moles |
| moles then fw | amt  |
| fw then moles  | amt  |

The equiv value for row 1 is set to 1 and cannot be edited by the user.

For all non-initial rows for initial entry, the permitted ways of entering values are tabulated below -

|  User Enters  | Automatically Calculated |
| ------------- | ------------- |
| equiv then fw  | mol and amt  |
| fw then equiv  | mol and amt |
| fw then amt | mol and equiv  |
| amt then fw  | mol and equiv  |
| equiv  | mol  |
| mol  | equiv  |
| amt then mol  | equiv and fw |
| fwd then mol  | equiv and amt |

Once the first row and the rows needed for experiment are filled, add the Stochiometry to the page.

### Changing the values of the records of the experiment:

For row 1, the behaviour is as below - 

|  User Changes  | Automatically Calculated |
| ------------- | ------------- |
| amt  | mol and amt are recalculated for all rows which have valid values |
| mol  | mol and amt are recalculated for all rows  which have valid values |
| fw  | amt is recalculated for row 1 |

For rows greater than 1, the behaviour is as below - 

|  User Changes  | Automatically Calculated |
| ------------- | ------------- |
| amt  | equiv and moles are recalculated for the row for which the amt was changed |
| equiv  | amt and moles are recalculated for the row for which the equiv was changed  |
| fw  | amt and moles are recalculated for the row for which the fw was changed  |

### For volume and density fields

If the user enters density to the experiment, the volume will be automatically calculated by the formula -
volume = amount / density

Filling density and volumes field is optional to the experiment and is used when gases are involved
in the chemical equation.

Volume will be re-calculated whenever the amount value changes.
