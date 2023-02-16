import { WrappedVerifiableCredential } from '@dvp/api-interfaces';
import { act, render, waitFor } from '@testing-library/react';
import { CHAFTA_COO } from '../fixtures';
import {
  reducer,
  RendererViewer,
  VCDocumentActionType,
  _getRendererURl,
} from './RendererViewer';

describe('RendererViewer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RendererViewer document={CHAFTA_COO} />);
    expect(baseElement).toBeTruthy();
  });

  it('should show VcUtility component', () => {
    const { getByTestId } = render(<RendererViewer document={CHAFTA_COO} />);
    expect(getByTestId('vc-utility')).toBeTruthy();
  });

  it('should show the tabs', async () => {
    const { getByTestId, getByRole } = render(
      <RendererViewer document={CHAFTA_COO} />
    );

    await waitFor(() => {
      expect(getByRole('tab', { selected: true }).textContent).toBe('Render');
      expect(getByRole('tab', { name: 'Json view' })).toBeTruthy();
      expect(getByTestId('tab-panel-0')).toBeTruthy();
    });
  });

  it('should switch to the second tab and display the contents', async () => {
    const { getByRole, getByTestId } = render(
      <RendererViewer document={CHAFTA_COO} />
    );

    act(() => {
      getByRole('tab', { name: 'Json view' }).click();
    });

    await waitFor(() => {
      expect(getByRole('tab', { selected: true }).textContent).toBe('Json');
      expect(JSON.parse(getByTestId('tab-panel-1')?.textContent)).toMatchObject(
        CHAFTA_COO.credentialSubject
      );
    });
  });
});

describe('_getRendererURl', () => {
  it('should return renderer url if url is specified in document', () => {
    if (CHAFTA_COO.openAttestationMetadata.template) {
      CHAFTA_COO.openAttestationMetadata.template.url = 'http://soopadoopa.com';
    }

    const res = _getRendererURl(CHAFTA_COO);
    expect(res).toStrictEqual('http://soopadoopa.com');
  });

  it('should return default renderer url if url is not specified in document', () => {
    if (CHAFTA_COO.openAttestationMetadata.template) {
      CHAFTA_COO.openAttestationMetadata.template.url = '';
    }

    const res = _getRendererURl(CHAFTA_COO);
    expect(res).toStrictEqual('https://generic-templates.tradetrust.io');
  });

  describe('reducer', () => {
    it('should return the initial state', () => {
      const action = {
        type: 'TEST' as VCDocumentActionType,
        payload: [],
      };

      expect(reducer({ document: CHAFTA_COO }, action)).toStrictEqual({
        document: CHAFTA_COO,
      });
    });

    it('should handle OBFUSCATE', () => {
      const action = {
        type: VCDocumentActionType.Obfuscate,
        payload: 'credentialSubject.links',
      };

      expect(CHAFTA_COO.credentialSubject['links']).toBeDefined();
      expect(
        (CHAFTA_COO as WrappedVerifiableCredential).proof.privacy.obfuscated
          .length
      ).toStrictEqual(0);

      const res = reducer({ document: CHAFTA_COO }, action);

      expect(res.document?.credentialSubject['links']).not.toBeDefined();
      expect(
        (res.document as WrappedVerifiableCredential).proof.privacy.obfuscated
          .length
      ).toStrictEqual(1);
    });
  });
});
