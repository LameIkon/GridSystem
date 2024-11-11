
function shadowPalette(elevation = "medium", color = "0 0% 63%")
{
    if (elevation === "low")
    {
        return `0.3px 0.5px 0.7px hsl(${color} / 0.34), 0.4px 0.8px 1px -1.2px hsl(${color} / 0.34), 1px 2px 2.5px -2.5px hsl(${color} / 0.34)`
    }
    else if (elevation === "medium")
    {
        return `0.3px 0.5px 0.7px hsl(${color} / 0.36), 0.8px 1.6px 2px -0.8px hsl(${color} / 0.36), 2.1px 4.1px 5.2px -1.7px hsl(${color} / 0.36), 5px 10px 12.6px -2.5px hsl(${color} / 0.36)`
    }
}

function createShadows()
{
    let controlpanelStyle = document.getElementById("controlpanel");
    for (let i = 0; i < controlpanelStyle.length; i++)
    {
        controlpanelStyle[i].style.boxShadow = shadowPalette("low", "0 0% 51%");
    }

    let controlpanelCard = document.querySelectorAll(".controlpanel-card");
    for (let i = 0; i < controlpanelCard.length; i++)
    {
        controlpanelCard[i].style.boxShadow = shadowPalette("medium", "0 0% 63%");
    }
}

function buttonEffects()
{
    let buttons = document.querySelectorAll(".run-button");
    for (let i = 0; i < buttons.length; i++)
    {
        buttons[i].addEventListener("mouseover", function(e)
        {
            e.target.style.background = "hsl(158 95% 53%)";
        });
        buttons[i].addEventListener("mouseleave", function(e)
        {
            e.target.style.background = "hsl(158 95% 40%)";
        });
        buttons[i].addEventListener("click", function(e)
        {
            e.target.style.background = "hsl(44 95% 70%)";
        });
    }
 }


function buttonMove() {
    let buttons = document.querySelectorAll(".run-button");
    for (let i = 0; i < buttons.length; i++)
    {
        buttons[i].addEventListener("click", buttonMovement);
    }
}

function buttonMovement(event)
{
    let dir = event.srcElement.id.split('-')[1]; // Take the id of the button element splitting it at take the second elemet, which is either 'left', 'right', 'up' or 'down'
    let steps = event.srcElement.parentNode.childNodes[1].childNodes[0].value; // Get the source elements parent then the span child object then the child input and the value of it. Quite hard coded but it works.
    move(dir, steps);
}


setTimeout(buttonsLoad, 50);

function buttonsLoad()
{
    createShadows();
    buttonEffects();
    renderTurnCounter();
    buttonMove();
}
