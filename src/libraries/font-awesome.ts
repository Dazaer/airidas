import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
//import { dom } from "@fortawesome/fontawesome-svg-core";
//import { fab } from "@fortawesome/free-brands-svg-icons";
import { faSpinner, faMusic, faQuestionCircle, faQuestion, faUtensils, faFlask, faCamera, faCheck, faBook, faDesktop, faBookReader, faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons/faLinkedin";
import { faFacebook } from "@fortawesome/free-brands-svg-icons/faFacebook";

library.add(
	//Solids (fas)
	faBook,
	faBookReader,
	faCamera,
	faCheck,
	faDesktop,
	faFlask,
	faMusic,
	faPencilAlt,
	faQuestion,
	faQuestionCircle,
	faSpinner,
	faTrash,
	faUtensils,
	//Brands (fab)
	faLinkedin,
	faFacebook,
	//fab
);

//dom.watch();

export { FontAwesomeIcon };
