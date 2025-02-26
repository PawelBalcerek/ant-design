/* eslint-disable react/no-multi-comp */
import MockDate from 'mockdate';
import moment from 'moment';
import React from 'react';
import { render } from '../../../tests/utils';
import type { Locale } from '..';
import LocaleProvider from '..';
import {
  Calendar,
  DatePicker,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Table,
  TimePicker,
  Transfer,
} from '../..';
import mountTest from '../../../tests/shared/mountTest';
import arEG from '../ar_EG';
import azAZ from '../az_AZ';
import bgBG from '../bg_BG';
import bnBD from '../bn_BD';
import byBY from '../by_BY';
import caES from '../ca_ES';
import csCZ from '../cs_CZ';
import daDK from '../da_DK';
import deDE from '../de_DE';
import elGR from '../el_GR';
import enGB from '../en_GB';
import enUS from '../en_US';
import esES from '../es_ES';
import etEE from '../et_EE';
import faIR from '../fa_IR';
import fiFI from '../fi_FI';
import frBE from '../fr_BE';
import frCA from '../fr_CA';
import frFR from '../fr_FR';
import gaIE from '../ga_IE';
import glES from '../gl_ES';
import heIL from '../he_IL';
import hiIN from '../hi_IN';
import hrHR from '../hr_HR';
import huHU from '../hu_HU';
import hyAM from '../hy_AM';
import idID from '../id_ID';
import isIS from '../is_IS';
import itIT from '../it_IT';
import jaJP from '../ja_JP';
import kaGE from '../ka_GE';
import kkKZ from '../kk_KZ';
import kmrIQ from '../kmr_IQ';
import kmKH from '../km_KH';
import knIN from '../kn_IN';
import koKR from '../ko_KR';
import kuIQ from '../ku_IQ';
import ltLT from '../lt_LT';
import lvLV from '../lv_LV';
import mkMK from '../mk_MK';
import mlIN from '../ml_IN';
import mnMN from '../mn_MN';
import msMY from '../ms_MY';
import nbNO from '../nb_NO';
import neNP from '../ne_NP';
import nlBE from '../nl_BE';
import nlNL from '../nl_NL';
import plPL from '../pl_PL';
import ptBR from '../pt_BR';
import ptPT from '../pt_PT';
import roRO from '../ro_RO';
import ruRU from '../ru_RU';
import siLK from '../si_LK';
import skSK from '../sk_SK';
import slSI from '../sl_SI';
import srRS from '../sr_RS';
import svSE from '../sv_SE';
import taIN from '../ta_IN';
import thTH from '../th_TH';
import tkTK from '../tk_TK';
import trTR from '../tr_TR';
import ukUA from '../uk_UA';
import urPK from '../ur_PK';
import viVN from '../vi_VN';
import zhCN from '../zh_CN';
import zhHK from '../zh_HK';
import zhTW from '../zh_TW';

const locales = [
  azAZ,
  arEG,
  bgBG,
  bnBD,
  byBY,
  caES,
  csCZ,
  daDK,
  deDE,
  elGR,
  enGB,
  enUS,
  esES,
  etEE,
  faIR,
  fiFI,
  frBE,
  frCA,
  frFR,
  gaIE,
  glES,
  heIL,
  hiIN,
  hrHR,
  huHU,
  hyAM,
  isIS,
  itIT,
  jaJP,
  kaGE,
  kkKZ,
  knIN,
  koKR,
  kmKH,
  kmrIQ,
  kuIQ,
  ltLT,
  mkMK,
  mlIN,
  msMY,
  mnMN,
  nbNO,
  neNP,
  nlBE,
  nlNL,
  plPL,
  ptBR,
  ptPT,
  roRO,
  ruRU,
  siLK,
  skSK,
  slSI,
  srRS,
  svSE,
  taIN,
  thTH,
  trTR,
  tkTK,
  ukUA,
  viVN,
  idID,
  lvLV,
  zhCN,
  zhHK,
  zhTW,
  urPK,
];

const { Option } = Select;
const { RangePicker } = DatePicker;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    filters: [{ text: 'filter1', value: 'filter1' }],
  },
  { title: 'Age', dataIndex: 'age' },
];

const App = () => (
  <div>
    <Pagination defaultCurrent={1} total={50} showSizeChanger />
    <Select showSearch style={{ width: 200 }}>
      <Option value="jack">jack</Option>
      <Option value="lucy">lucy</Option>
    </Select>
    <DatePicker open />
    <TimePicker open defaultOpenValue={moment()} />
    <RangePicker open style={{ width: 200 }} />
    <Popconfirm title="Question?" open>
      <a>Click to confirm</a>
    </Popconfirm>
    <Transfer dataSource={[]} showSearch targetKeys={[]} render={(item: any) => item.title} />
    <Calendar fullscreen={false} value={moment()} />
    <Table dataSource={[]} columns={columns} />
    <Modal title="Locale Modal" open getContainer={false}>
      <p>Locale Modal</p>
    </Modal>
  </div>
);

describe('Locale Provider', () => {
  mountTest(() => (
    <LocaleProvider locale={null as unknown as Locale}>
      <div />
    </LocaleProvider>
  ));

  beforeAll(() => {
    MockDate.set(moment('2017-09-18T03:30:07.795').valueOf());
  });

  afterAll(() => {
    MockDate.reset();
  });

  locales.forEach(locale => {
    it(`should display the text as ${locale.locale}`, () => {
      const { container } = render(
        <LocaleProvider locale={locale}>
          <App />
        </LocaleProvider>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('should change locale of Modal.xxx', () => {
    locales.forEach(locale => {
      const { container } = render(
        <LocaleProvider locale={locale}>
          <Modal title="Locale Modal" visible getContainer={false}>
            Modal
          </Modal>
        </LocaleProvider>,
      );
      let cancelButtonText = container?.querySelector('button.ant-btn-default span')?.innerHTML;
      let okButtonText = container?.querySelector('button.ant-btn-primary span')?.innerHTML;
      if (locale.locale.includes('zh-')) {
        cancelButtonText = cancelButtonText?.replace(' ', '');
        okButtonText = okButtonText?.replace(' ', '');
      }
      expect(cancelButtonText).toBe(locale.Modal?.cancelText);
      expect(okButtonText).toBe(locale.Modal?.okText);
    });
  });

  it('set moment locale when locale changes', () => {
    const Test = ({ locale }: { locale?: Locale }) => (
      <LocaleProvider locale={locale!}>
        <div>
          <DatePicker defaultValue={moment()} open />
        </div>
      </LocaleProvider>
    );

    const { container, rerender } = render(<Test locale={zhCN} />);
    expect(container.firstChild).toMatchSnapshot();

    rerender(<Test locale={frFR} />);
    expect(container.firstChild).toMatchSnapshot();

    rerender(<Test />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
