import { ArcherContainer} from "react-archer";

export class AppArcherContainer extends ArcherContainer {

    _getRectFromRef = (ref) => {
        if (!ref) return null;
        let rect = ref.getBoundingClientRect();
        let zoom = this.props.engine.model.options.zoom;
        if(! zoom || zoom === 100){
            return rect;
        }
        rect.x = rect.x * 100 / zoom;
        rect.y = rect.y * 100 / zoom;
        rect.width = rect.width * 100 / zoom;
        rect.height = rect.height * 100 / zoom;
        return rect;
      };
}