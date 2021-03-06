const expect = require('expect-puppeteer');
const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');

const feature1 = loadFeature('./e2e/features/userCRUD/addFriend.feature');
const feature2 = loadFeature('./e2e/features/userCRUD/listFriends.feature');
const feature3 = loadFeature('./e2e/features/userCRUD/deleteFriends.feature');


let port = 3000;
let url = 'http://localhost:' + port;

let webId1 = "https://viadees2atester1.inrupt.net/profile/card#me";
let username1 = "viadeES2Atester1";
let password1 = "viadeES2A_password_1";

let webId2 = "https://viadees2atester2.inrupt.net/profile/card#me";
let webId3 = "https://alejandrine3.inrupt.net/profile/card#me";
let webId4 = "https://jesusperez97.inrupt.net/profile/card#me";

var page;

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

beforeAll(async () => {
    //Open browser
    const browser = await puppeteer.launch({
        //headless let watch the chrome window interacting with the application
        headless: false,
        defaultViewport: null
    });
    page = await browser.newPage();

    //Borrar cookies
    await page.goto('chrome://settings/clearBrowserData');
    await page.keyboard.down('Enter');

    await delay(5000);
    
    await page.goto(url);

    /** 
     *  ######################################################################################
     *  ################# Log in #############################################################
     *  ######################################################################################
     */

    //Wait for login button
    await page.waitForSelector('button[data-testid="provider-form-button"]');
    //Check if already logged
    const logueate = await expect(page).toMatchElement('button[data-testid="provider-form-button"]');
    //If not already logged
    if (logueate !== null) {
        //Fill webId
        await expect(page).toFill('input[name="idp"]', webId1);
        await page.click('[type="submit"]');

        //Wait for user-pass screen
        await page.waitForSelector('input[name="username"]');
        //Fill user and pass
        await expect(page).toFill('input[name="username"]', username1);
        await expect(page).toFill('input[name="password"]', password1);
        await page.click('[id="login"]');

        //Wait for the main nav-bar icon
        await page.waitForSelector('img[src="img/bars-nav.svg"]');
    } else {
        //Wait for the main nav-bar icon
        await page.waitForSelector('img[src="img/bars-nav.svg"]');
    }

});


defineFeature(feature1, test1 => {
    test1('Paco wants to add new friends', ({ given, when, then }) => {

        given('Paco has logged in successfully into the application', () => {
            //Already done in beforeAll() statement
        });

        when('Paco adds three new friends by introducing their webIds', async () => {
            await page.goto("http://localhost:" + port + "/#/feed");

            // Add Pedro
            await page.waitForSelector('button[name="create-route-floating-button"]');
            await page.click('button[name="create-route-floating-button"]');

            await page.waitForSelector('input[name="value-friend-webID"]');
            await expect(page).toFill('input[name="value-friend-webID"]', webId2);

            await page.click('button[name="add-friend-button"]');

            await delay(5000);

            // Add Alejandro
            await page.waitForSelector('button[name="create-route-floating-button"]');
            await page.click('button[name="create-route-floating-button"]');

            await page.waitForSelector('input[name="value-friend-webID"]');
            await expect(page).toFill('input[name="value-friend-webID"]', webId3);

            await page.click('button[name="add-friend-button"]');

            await delay(5000);

            // Add Jesus
            await page.waitForSelector('button[name="create-route-floating-button"]');
            await page.click('button[name="create-route-floating-button"]');

            await page.waitForSelector('input[name="value-friend-webID"]');
            await expect(page).toFill('input[name="value-friend-webID"]', webId4);

            await page.click('button[name="add-friend-button"]');

            await delay(5000);
        });

        then('Paco can view his new friends in his friends list', async () => {
            // Check new friends added
            await page.waitForFunction(
                'document.querySelector("body").innerText.includes("https://viadees2atester2.inrupt.net/profile/card#me")');
            await page.waitForFunction(
                'document.querySelector("body").innerText.includes("https://alejandrine3.inrupt.net/profile/card#me")');
            await page.waitForFunction(
                'document.querySelector("body").innerText.includes("https://jesusperez97.inrupt.net/profile/card#me")');
        });
    });
});

defineFeature(feature2, test2 => {
    test2('Paco wants to list his friends', ({ given, when, then }) => {

        given('Paco has logged in successfully into the application', () => {
            //Already done in beforeAll() statement
        });

        when('Paco goes to the feed section', async () => {
            await page.goto("http://localhost:" + port + "/#/feed");

            await delay(5000);
        });

        then('Paco can see his three friends', async () => {
            // Check Pedro appears
            await page.waitForFunction('document.querySelector("body").innerText.includes("https://viadees2atester2.inrupt.net/profile/card#me")');
            await page.waitForSelector('div[name="click-https://viadees2atester2.inrupt.net/profile/card#me"]');

            // Check Alejandro appears
            await page.waitForFunction('document.querySelector("body").innerText.includes("https://alejandrine3.inrupt.net/profile/card#me")');
            await page.waitForSelector('div[name="click-https://alejandrine3.inrupt.net/profile/card#me"]');

            // Check Jesus appears
            await page.waitForFunction('document.querySelector("body").innerText.includes("https://jesusperez97.inrupt.net/profile/card#me")');
            await page.waitForSelector('div[name="click-https://jesusperez97.inrupt.net/profile/card#me"]');

            await delay(5000);

            // Click on them
            await page.click('div[name="click-https://viadees2atester2.inrupt.net/profile/card#me"]');
            await page.click('div[name="click-https://alejandrine3.inrupt.net/profile/card#me"]');
            await page.click('div[name="click-https://jesusperez97.inrupt.net/profile/card#me"]');

            await delay(3000);

            // Check that delete and profile options appear
            await expect(page).toMatchElement('button[name="delete-https://viadees2atester2.inrupt.net/profile/card#me"]');
            await expect(page).toMatchElement('button[name="openProfile-https://viadees2atester2.inrupt.net/profile/card#me"]');

            await delay(3000);

            // Check that delete and profile options appear
            await expect(page).toMatchElement('button[name="delete-https://alejandrine3.inrupt.net/profile/card#me"]');
            await expect(page).toMatchElement('button[name="openProfile-https://alejandrine3.inrupt.net/profile/card#me"]');

            await delay(3000);
            
            // Check that delete and profile options appear
            await expect(page).toMatchElement('button[name="delete-https://jesusperez97.inrupt.net/profile/card#me"]');
            await expect(page).toMatchElement('button[name="openProfile-https://jesusperez97.inrupt.net/profile/card#me"]');
        });
    });
});

defineFeature(feature3, test3 => {
    test3('Paco wants to delete some friends', ({ given, when, then }) => {

        given('Paco has logged in successfully into the application', () => {
            //Already done in beforeAll() statement
        });

        when('Paco deletes each of his friends', async () => {
            // Check Pedro appears
            await page.waitForSelector('button[name="delete-https://viadees2atester2.inrupt.net/profile/card#me"]');
            await page.click('button[name="delete-https://viadees2atester2.inrupt.net/profile/card#me"]');
            await delay(2000);
            await page.waitForSelector('button[data-testid="acceptButton"]');
            await page.click('button[data-testid="acceptButton"]');
            await delay(5000);

            // Check Alejandro appears
            await page.waitForSelector('button[name="delete-https://alejandrine3.inrupt.net/profile/card#me"]');
            await page.click('button[name="delete-https://alejandrine3.inrupt.net/profile/card#me"]');
            await delay(2000);
            await page.waitForSelector('button[data-testid="acceptButton"]');
            await page.click('button[data-testid="acceptButton"]');
            await delay(5000);

            // Check Jesus appears
            await page.waitForSelector('button[name="delete-https://jesusperez97.inrupt.net/profile/card#me"]');
            await page.click('button[name="delete-https://jesusperez97.inrupt.net/profile/card#me"]');
            await delay(2000);
            await page.waitForSelector('button[data-testid="acceptButton"]');
            await page.click('button[data-testid="acceptButton"]');
            await delay(5000);
        });

        then('Paco cannot see his deleted friends', async () => {
            // Expect Pedro to disappear
            var pedroExists = null;
            try {
                pedroExists = await expect(page).toMatchElement('div[name="click-https://viadees2atester2.inrupt.net/profile/card#me"]');
            } catch (error) {
                //There will be an error if everything is alright
            }
            if (pedroExists !== null) {
                throw new Error("Pedro was not removed");
            }

            // Expect Alejandro to disappear
            var alejandroExists = null;
            try {
                alejandroExists = await expect(page).toMatchElement('div[name="click-https://alejandrine3.inrupt.net/profile/card#me"]');
            } catch (error) {
                //There will be an error if everything is alright
            }
            if (alejandroExists !== null) {
                throw new Error("Alejandro was not removed");
            }

            // Expect Jesus to disappear
            var jesusExists = null;
            try {
                jesusExists = await expect(page).toMatchElement('div[name="click-https://jesusperez97.inrupt.net/profile/card#me"]');
            } catch (error) {
                //There will be an error if everything is alright
            }
            if (jesusExists !== null) {
                throw new Error("Jesus was not removed");
            }
        });
    });
});


