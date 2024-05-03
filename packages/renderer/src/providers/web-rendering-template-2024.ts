import { IRendererProvider, RenderDocument } from '@vckit/core-types';
import handlebars from 'handlebars';
/**
 * @public
 */
export class WebRenderingTemplate2024 implements IRendererProvider {
    async renderCredential(
        template?: string,
        document?: RenderDocument,
        url?: string,
        digestMultibase?: string,
    ): Promise<string> {
        // Check if the template is empty or contains only whitespace
        console.log(url);
        let svgTemplate : string|any = '';
        if(url){
            await fetch(url).then(async response => svgTemplate = await response.text());
        }
        const compiledTemplate = handlebars.compile(svgTemplate);
        
        const renderedContent = compiledTemplate(document);

        return renderedContent;
    }
}