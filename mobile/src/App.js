import React from "react";
import { Root } from "native-base";
import { StackNavigator, DrawerNavigator } from "react-navigation";

import DevSample from "./screens/devSample";
import Header1 from "./screens/devSample/Header/1";
import Header2 from "./screens/devSample/Header/2";
import Header3 from "./screens/devSample/Header/3";
import Header4 from "./screens/devSample/Header/4";
import Header5 from "./screens/devSample/Header/5";
import Header6 from "./screens/devSample/Header/6";
import Header7 from "./screens/devSample/Header/7";
import Header8 from "./screens/devSample/Header/8";
import HeaderSpan from "./screens/devSample/Header/header-span";
import HeaderNoShadow from "./screens/devSample/Header/header-no-shadow";
import BasicFooter from "./screens/devSample/footer/basicFooter";
import IconFooter from "./screens/devSample/footer/iconFooter";
import IconText from "./screens/devSample/footer/iconText";
import BadgeFooter from "./screens/devSample/footer/badgeFooter";
import Default from "./screens/devSample/button/default";
import Outline from "./screens/devSample/button/outline";
import Rounded from "./screens/devSample/button/rounded";
import Block from "./screens/devSample/button/block";
import Full from "./screens/devSample/button/full";
import Custom from "./screens/devSample/button/custom";
import Transparent from "./screens/devSample/button/transparent";
import IconBtn from "./screens/devSample/button/iconBtn";
import Disabled from "./screens/devSample/button/disabled";
import BasicCard from "./screens/devSample/card/basic";
import NHCardItemBordered from "./screens/devSample/card/carditem-bordered";
import NHCardItemButton from "./screens/devSample/card/carditem-button";
import NHCardImage from "./screens/devSample/card/card-image";
import NHCardShowcase from "./screens/devSample/card/card-showcase";
import NHCardList from "./screens/devSample/card/card-list";
import NHCardHeaderAndFooter from "./screens/devSample/card/card-header-and-footer";
import NHCardTransparent from "./screens/devSample/card/card-transparent";
import BasicFab from "./screens/devSample/fab/basic";
import MultipleFab from "./screens/devSample/fab/multiple";
import FixedLabel from "./screens/devSample/form/fixedLabel";
import InlineLabel from "./screens/devSample/form/inlineLabel";
import FloatingLabel from "./screens/devSample/form/floatingLabel";
import PlaceholderLabel from "./screens/devSample/form/placeholder";
import StackedLabel from "./screens/devSample/form/stacked";
import RegularInput from "./screens/devSample/form/regular";
import UnderlineInput from "./screens/devSample/form/underline";
import RoundedInput from "./screens/devSample/form/rounded";
import IconInput from "./screens/devSample/form/iconInput";
import SuccessInput from "./screens/devSample/form/success";
import ErrorInput from "./screens/devSample/form/error";
import DisabledInput from "./screens/devSample/form/disabledInput";
import Icons from "./screens/devSample/icon/icon";
import BasicIcon from "./screens/devSample/icon/basic";
import StateIcon from "./screens/devSample/icon/state";
import PlatformSpecificIcon from "./screens/devSample/icon/platform-specific";
import IconFamily from "./screens/devSample/icon/icon-family";
import RowNB from "./screens/devSample/layout/row";
import ColumnNB from "./screens/devSample/layout/column";
import NestedGrid from "./screens/devSample/layout/nested";
import CustomRow from "./screens/devSample/layout/customRow";
import CustomCol from "./screens/devSample/layout/customCol";
import BasicListSwipe from "./screens/devSample/listSwipe/basic-list-swipe";
import SwipeRowCustomStyle from "./screens/devSample/listSwipe/swipe-row-style";
import MultiListSwipe from "./screens/devSample/listSwipe/multi-list-swipe";
import NHBasicList from "./screens/devSample/list/basic-list";
import NHListItemSelected from "./screens/devSample/list/listitem-selected";
import NHListDivider from "./screens/devSample/list/list-divider";
import NHListSeparator from "./screens/devSample/list/list-separator";
import NHListHeader from "./screens/devSample/list/list-headers";
import NHListIcon from "./screens/devSample/list/list-icon";
import NHListAvatar from "./screens/devSample/list/list-avatar";
import NHListThumbnail from "./screens/devSample/list/list-thumbnail";
import RegularPicker from "./screens/devSample/picker/regularPicker";
import PickerWithIcon from "./screens/devSample/picker/picker-with-icon";
import PlaceholderPicker from "./screens/devSample/picker/placeholderPicker";
import PlaceholderPickerNote from "./screens/devSample/picker/placeholderPickernote";
import BackButtonPicker from "./screens/devSample/picker/backButtonPicker";
import PickerTextItemText from "./screens/devSample/picker/picker-text-itemtext";
import HeaderPicker from "./screens/devSample/picker/headerPicker";
import HeaderStylePicker from "./screens/devSample/picker/headerStylePicker";
import CustomHeaderPicker from "./screens/devSample/picker/customHeaderPicker";
import BasicTab from "./screens/devSample/tab/basicTab";
import ConfigTab from "./screens/devSample/tab/configTab";
import ScrollableTab from "./screens/devSample/tab/scrollableTab";
import BasicSegment from "./screens/devSample/segment/SegmentHeader";
import BasicToast from "./screens/devSample/toast/basic-toast";
import ToastDuration from "./screens/devSample/toast/toast-duration";
import ToastPosition from "./screens/devSample/toast/toast-position";
import ToastType from "./screens/devSample/toast/toast-type";
import ToastText from "./screens/devSample/toast/toast-text";
import ToastButton from "./screens/devSample/toast/toast-button";
import RegularActionSheet from "./screens/devSample/actionsheet/regular";
import IconActionSheet from "./screens/devSample/actionsheet/icon";
import AdvSegment from "./screens/devSample/segment/segmentTab";
import SimpleDeck from "./screens/devSample/deckswiper/simple";
import AdvancedDeck from "./screens/devSample/deckswiper/advanced";
import TextArea from "./screens/devSample/form/textArea";

import Anatomy from "./screens/devSample/anatomy/";
import Header from "./screens/devSample/Header/";
import Footer from "./screens/devSample/footer/";
import NHBadge from "./screens/devSample/badge/";
import NHButton from "./screens/devSample/button/";
import NHCard from "./screens/devSample/card/";
import NHCheckbox from "./screens/devSample/checkbox/";
import NHDeckSwiper from "./screens/devSample/deckswiper/";
import NHFab from "./screens/devSample/fab/";
import NHForm from "./screens/devSample/form/";
import NHIcon from "./screens/devSample/icon/";
import NHLayout from "./screens/devSample/layout/";
import NHList from "./screens/devSample/list/";
import ListSwipe from "./screens/devSample/listSwipe/";
import NHRadio from "./screens/devSample/radio/";
import NHSearchbar from "./screens/devSample/searchbar/";
import NHSpinner from "./screens/devSample/spinner/";
import NHPicker from "./screens/devSample/picker/";
import NHTab from "./screens/devSample/tab/";
import NHThumbnail from "./screens/devSample/thumbnail/";
import NHTypography from "./screens/devSample/typography/";
import Segment from "./screens/devSample/segment";
import NHToast from "./screens/devSample/toast/";
import Actionsheet from "./screens/devSample/actionsheet";

import SideBar from "./screens/sidebar";

import Home from "./screens/home/";
import Projects from "./screens/projects";
import Teams from "./screens/teams";
import Permissions from "./screens/permissions";
import Users from "./screens/users";

import CreateProject from "./screens/createProject";
import ProjectInfo from "./screens/projectInfo";
import Requirements from "./screens/requirements";

import CreateTeam from "./screens/createTeam";
import TeamMembers from "./screens/teamMembers";

import AddUser from "./screens/adduser";

const Drawer = DrawerNavigator(
  {
    // app screens
    Home: { screen: Home },
    Projects: { screen: Projects },
    Teams: { screen: Teams },
    Permissions: { screen: Permissions },
    Users: { screen: Users },

    CreateProject: { screen: CreateProject },
    ProjectInfo: { screen: ProjectInfo },
    Requirements: { screen: Requirements },

    CreateTeam: { screen: CreateTeam },
    TeamMembers: { screen: TeamMembers },

    AddUser: { screen: AddUser },

    //dev screens
    DevSample: { screen: DevSample },
  },
  {
    initialRouteName: "Projects",
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    contentComponent: props => <SideBar {...props} />
  }
);

const AppNavigator = StackNavigator(
  {
    Drawer: { screen: Drawer },

    // app screens
    CreateProject: { screen: CreateProject },
    ProjectInfo: { screen: ProjectInfo },
    Requirements: { screen: Requirements },

    CreateTeam: { screen: CreateTeam },
    TeamMembers: { screen: TeamMembers },

    AddUser: { screen: AddUser },

    //dev screens
    Anatomy: { screen: Anatomy },
    Header: { screen: Header },
    Footer: { screen: Footer },
    NHBadge: { screen: NHBadge },
    NHButton: { screen: NHButton },
    NHCard: { screen: NHCard },
    NHCheckbox: { screen: NHCheckbox },
    NHDeckSwiper: { screen: NHDeckSwiper },
    NHFab: { screen: NHFab },
    NHForm: { screen: NHForm },
    NHIcon: { screen: NHIcon },
    NHLayout: { screen: NHLayout },
    NHList: { screen: NHList },
    ListSwipe: { screen: ListSwipe },
    NHRadio: { screen: NHRadio },
    NHSearchbar: { screen: NHSearchbar },
    NHSpinner: { screen: NHSpinner },
    NHPicker: { screen: NHPicker },
    NHTab: { screen: NHTab },
    NHThumbnail: { screen: NHThumbnail },
    NHTypography: { screen: NHTypography },
    Segment: { screen: Segment },
    NHToast: { screen: NHToast },
    Actionsheet: { screen: Actionsheet },

    Header1: { screen: Header1 },
    Header2: { screen: Header2 },
    Header3: { screen: Header3 },
    Header4: { screen: Header4 },
    Header5: { screen: Header5 },
    Header6: { screen: Header6 },
    Header7: { screen: Header7 },
    Header8: { screen: Header8 },
    HeaderSpan: { screen: HeaderSpan },
    HeaderNoShadow: { screen: HeaderNoShadow },

    BasicFooter: { screen: BasicFooter },
    IconFooter: { screen: IconFooter },
    IconText: { screen: IconText },
    BadgeFooter: { screen: BadgeFooter },

    Default: { screen: Default },
    Outline: { screen: Outline },
    Rounded: { screen: Rounded },
    Block: { screen: Block },
    Full: { screen: Full },
    Custom: { screen: Custom },
    Transparent: { screen: Transparent },
    IconBtn: { screen: IconBtn },
    Disabled: { screen: Disabled },

    BasicCard: { screen: BasicCard },
    NHCardItemBordered: { screen: NHCardItemBordered },
    NHCardItemButton: { screen: NHCardItemButton },
    NHCardImage: { screen: NHCardImage },
    NHCardShowcase: { screen: NHCardShowcase },
    NHCardList: { screen: NHCardList },
    NHCardHeaderAndFooter: { screen: NHCardHeaderAndFooter },
    NHCardTransparent: { screen: NHCardTransparent },

    SimpleDeck: { screen: SimpleDeck },
    AdvancedDeck: { screen: AdvancedDeck },

    BasicFab: { screen: BasicFab },
    MultipleFab: { screen: MultipleFab },

    FixedLabel: { screen: FixedLabel },
    InlineLabel: { screen: InlineLabel },
    FloatingLabel: { screen: FloatingLabel },
    PlaceholderLabel: { screen: PlaceholderLabel },
    StackedLabel: { screen: StackedLabel },
    RegularInput: { screen: RegularInput },
    UnderlineInput: { screen: UnderlineInput },
    RoundedInput: { screen: RoundedInput },
    IconInput: { screen: IconInput },
    SuccessInput: { screen: SuccessInput },
    ErrorInput: { screen: ErrorInput },
    DisabledInput: { screen: DisabledInput },
    TextArea: { screen: TextArea },

    Icons: { screen: Icons },
    BasicIcon: { screen: BasicIcon },
    StateIcon: { screen: StateIcon },
    PlatformSpecificIcon: { screen: PlatformSpecificIcon },
    IconFamily: { screen: IconFamily },

    RowNB: { screen: RowNB },
    ColumnNB: { screen: ColumnNB },
    NestedGrid: { screen: NestedGrid },
    CustomRow: { screen: CustomRow },
    CustomCol: { screen: CustomCol },

    NHBasicList: { screen: NHBasicList },
    NHListItemSelected: { screen: NHListItemSelected },
    NHListDivider: { screen: NHListDivider },
    NHListSeparator: { screen: NHListSeparator },
    NHListHeader: { screen: NHListHeader },
    NHListIcon: { screen: NHListIcon },
    NHListAvatar: { screen: NHListAvatar },
    NHListThumbnail: { screen: NHListThumbnail },

    BasicListSwipe: { screen: BasicListSwipe },
    SwipeRowCustomStyle: { screen: SwipeRowCustomStyle },
    MultiListSwipe: { screen: MultiListSwipe },

    RegularPicker: { screen: RegularPicker },
    PickerWithIcon: { screen: PickerWithIcon },
    PlaceholderPicker: { screen: PlaceholderPicker },
    PlaceholderPickerNote: { screen: PlaceholderPickerNote },
    BackButtonPicker: { screen: BackButtonPicker },
    PickerTextItemText: { screen: PickerTextItemText },
    HeaderPicker: { screen: HeaderPicker },
    HeaderStylePicker: { screen: HeaderStylePicker },
    CustomHeaderPicker: { screen: CustomHeaderPicker },

    BasicTab: { screen: BasicTab },
    ConfigTab: { screen: ConfigTab },
    ScrollableTab: { screen: ScrollableTab },

    BasicSegment: { screen: BasicSegment },
    AdvSegment: { screen: AdvSegment },

    BasicToast: { screen: BasicToast },
    ToastDuration: { screen: ToastDuration },
    ToastPosition: { screen: ToastPosition },
    ToastType: { screen: ToastType },
    ToastText: { screen: ToastText },
    ToastButton: { screen: ToastButton },

    RegularActionSheet: { screen: RegularActionSheet },
    IconActionSheet: { screen: IconActionSheet }

  },
  {
    initialRouteName: "Drawer",
    headerMode: "none"
  }
);

export default () =>
  <Root>
    <AppNavigator />
  </Root>;
