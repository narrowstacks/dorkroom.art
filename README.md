# Dorkroom.art 

 This is a website that contains calculators for darkroom and film photography purposes. Many of these these calculators are based on exisiting algorithms, but have been put into a graphical web interface to be more user-friendly and easier to use.
 ## Currently implemented calculators:
 - **Darkroom easel border calculator**, which calculates the easel blade positions of the easel for a given film and paper sizes, and displays a preview of the print on the paper.
 - **Stop-based exposure calculator**, for calculating the exposure time when adjusting one's exposure based on the number of stops.
 - **Print resize calculator**, for calculating the change in stops/seconds of the print when resizing the projection of an image on an enlarger.
## Planned calculators:
- **Film exposure conversion calculator**, which helps user maintain or change their relative exposure based on ISO, aperture, and shutter speed.
- **Dilution calculator**, which helps user calculate the amount of water needed to dilute a given amount of developer, including presets  for various developers and dilution ratios.
- **Film push/pull calculator**, which helps user calculate the amount of time to push or pull their film based on the number of stops pushed or pulled when shooting.
- **Reciprocity calculator**, which helps user calculate the amount of time to add to their exposure based on the number of stops of reciprocity failure.

## To-Do:
- Add disclaimers, instructions, and any other information to each page about the limitations of the calculators.
- Add an about page.
- Add a donation link.
- Add toggle for metric/imperial units site-wide.


## Other implemented features:
  - Light, darkroom (red/black), and high contrast color (black/white for e-ink displays) scheme switcher.

## Technologies Used
Pure HTML, Javascript, and CSS! No frameworks or libraries were used.

Otherwise, [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) is used for consistent formatting.

## Deploying the Website
As this is a series of static web pages with no server-side elements, you can simply download the files and run them on an apache or nginx server. An easy way to get started is clone the repository and install the VS Code Live Server extension, and run the home page index.html file.

# Contributing
Have a suggestion for a page or a calculator? Found a bug? [Open an issue on the github page](https://github.com/narrowstacks/dorkroom.art/issues)!

If you would like to contribute to this project, please create a fork, and make a pull request. 

Please do not incorporate any external libraries or frameworks into this project unless absolutely necessary, and justify the reasons why you are doing so. If you are unsure about whether a feature or change is appropriate, please open an issue on the github page.

Currently, there are no plans to implement any server-side elements to keep the project as lightweight as possible.

# Authors
This project was created by [Aaron F. Anderson](https://www.affords.art/), aka [narrowstacks](https://github.com/narrowstacks). 

# License
This project is licensed under the MIT License. See the [LICENSE.md](/LICENSE.md) file for more information.
