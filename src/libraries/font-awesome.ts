import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
//import { dom } from "@fortawesome/fontawesome-svg-core";
//import { fab } from "@fortawesome/free-brands-svg-icons";
import { faSpinner, faMusic, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons/faLinkedin";
import { faFacebook } from "@fortawesome/free-brands-svg-icons/faFacebook";

library.add(
	//Solids (fas)
	faSpinner,
	faMusic,
	faQuestionCircle,
	//Brands (fab)
	faLinkedin,
	faFacebook,
	//fab
);

//dom.watch();

export { FontAwesomeIcon };
