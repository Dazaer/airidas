import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { dom, library } from "@fortawesome/fontawesome-svg-core";
//import { dom } from "@fortawesome/fontawesome-svg-core";
//import { fab } from "@fortawesome/free-brands-svg-icons";
import {
	faSpinner, faMusic, faQuestionCircle, faQuestion, faUtensils, faFlask,
	faCamera, faCheck, faBook, faDesktop, faBookReader, faPencilAlt, faTrash,
	faTags, faSearch, faEye, faTimes, faChevronLeft, faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons/faLinkedin";
import { faFacebook } from "@fortawesome/free-brands-svg-icons/faFacebook";

library.add(
	//Solids (fas)
	faBook,
	faBookReader,
	faCamera,
	faCheck,
	faChevronLeft,
	faChevronRight,
	faDesktop,
	faEye,
	faFlask,
	faMusic,
	faPencilAlt,
	faQuestion,
	faQuestionCircle,
	faSearch,
	faSpinner,
	faTags,
	faTimes,
	faTrash,
	faUtensils,
	//Brands (fab)
	faLinkedin,
	faFacebook,
);

dom.watch();

export { FontAwesomeIcon };
