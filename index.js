
// Entry point for card construction
function construct_cards(data){
	let grid = document.getElementById("card-grid");
	for(let entry of data){
		grid.appendChild(create_card(entry));
	}
}

// Create each card based on provided data
function create_card(card_data){
	
	// Card Column
	let newCard = document.createElement("div");
	newCard.classList.add("col-4");

	// Card Space
	let cardSpace = document.createElement("div");
	cardSpace.classList.add("p-card");
	cardSpace.classList.add("bordered");
	newCard.appendChild(cardSpace);

	// Card header
	let cardHead = document.createElement("h5");
	cardHead.innerHTML = find_group(card_data);
	cardHead.classList.add("u-no-margin--bottom");
	cardHead.style["padding"] = "5px";
	cardSpace.appendChild(cardHead);

	// Horizontal rule ***************************
	let rule = document.createElement("hr");
	cardSpace.appendChild(rule);

	// Card Image
	let cardImg = document.createElement("img");
	cardImg.classList.add("p-card__image");
	cardImg.style["padding"] = "5px";
	cardImg.src = card_data.featured_media;
	cardSpace.appendChild(cardImg);

	// ++ Inner section (1/2)
	let inner_one = document.createElement("div");
	inner_one.classList.add("p-card__inner");
	inner_one.style["padding"] = "5px";

	// ++ Blog Post Title (added to inner_one)
	let titleLink = document.createElement('a');
	titleLink.href = card_data.link;
	let cardTitle = document.createElement("span");
	cardTitle.style["font-size"] = "1.5rem";
	cardTitle.style["font-weight"] = "500";
	cardTitle.innerHTML = card_data.title.rendered;
	titleLink.innerHTML = cardTitle.outerHTML;
	inner_one.appendChild(titleLink);

	// ++ Author byline (added to inner_one)
	let byline = document.createElement("p");
	byline.style["font-style"] = "italic";
	let authorLink = document.createElement("a");
	authorLink.href = card_data._embedded.author[0].link;
	authorLink.innerHTML = card_data._embedded.author[0].name;

	let datevals = new Date(card_data.date); 					  //*** 
	datevals = datevals.toDateString().split(" ");				  // formatting date
	datevals = [datevals[2], datevals[1], datevals[3]].join(" "); //***

	byline.innerHTML = "By " + authorLink.outerHTML + " on " + datevals;
	inner_one.appendChild(byline);

	// ++ ADDING inner section 1
	cardSpace.appendChild(inner_one);

	// Horizontal rule ***************************
	rule = document.createElement("hr");
	cardSpace.appendChild(rule);

	// Inner section (2/2)
	let inner_two = document.createElement("div");
	inner_two.classList.add("p-card__inner");
	inner_two.style["padding"] = "5px";
	inner_two.innerHTML = "Article";
	cardSpace.appendChild(inner_two);

	// Return the completed card
	return newCard;
}

// Find the most valid group name for the card header.
function find_group(card_data){
	let possible_categories = card_data._embedded["wp:term"];
	let i = possible_categories.length;
	for(i; i > 0; i--){
		for(let category of possible_categories[i-1]){
			if(category.name !== 'undefined') {
				return category.name.toUpperCase();
			}
		}
	}
}

// Loading message disable
function disable_message(){
	document.getElementById("message").remove();
}

// ** Main function execution **
// Retrieves data from api and creates cards
fetch("http://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json")
	.then((res) => res.json())
	.then((data) => {
		construct_cards(data);
		disable_message();
	})
	.catch(() => {
		console.error("WP API unavailable");
		document.getElementById("message").innerHTML = "Error fetching data.";
	});