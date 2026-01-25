/**
 * Core preset - minimal components for basic UI
 * ~80KB - for power users who want minimal bundle
 */
import type { Preset } from '@daui/core';

// Atoms
import Avatar from '../atoms/Avatar.svelte';
import Badge from '../atoms/Badge.svelte';
import Button from '../atoms/Button.svelte';
import Checkbox from '../atoms/Checkbox.svelte';
import Divider from '../atoms/Divider.svelte';
import Icon from '../atoms/Icon.svelte';
import IconButton from '../atoms/IconButton.svelte';
import Image from '../atoms/Image.svelte';
import Input from '../atoms/Input.svelte';
import NumberInput from '../atoms/NumberInput.svelte';
import Popover from '../atoms/Popover.svelte';
import Progress from '../atoms/Progress.svelte';
import RadioGroup from '../atoms/RadioGroup.svelte';
import Select from '../atoms/Select.svelte';
import Slider from '../atoms/Slider.svelte';
import Spinner from '../atoms/Spinner.svelte';
import Switch from '../atoms/Switch.svelte';
import Text from '../atoms/Text.svelte';
import Tooltip from '../atoms/Tooltip.svelte';

// Molecules
import Accordion from '../molecules/Accordion.svelte';
import AlertPanel from '../molecules/AlertPanel.svelte';
import DropdownMenu from '../molecules/DropdownMenu.svelte';
import Form from '../molecules/Form.svelte';
import Grid from '../molecules/Grid.svelte';
import List from '../molecules/List.svelte';
import PageHeader from '../molecules/PageHeader.svelte';
import Showcase from '../molecules/Showcase.svelte';
import Stack from '../molecules/Stack.svelte';
import Tabs from '../molecules/Tabs.svelte';

// Organisms
import AlertDialog from '../organisms/AlertDialog.svelte';
import Card from '../organisms/Card.svelte';
import Modal from '../organisms/Modal.svelte';

export const core: Preset = {
  atoms: {
    avatar: Avatar,
    badge: Badge,
    button: Button,
    checkbox: Checkbox,
    divider: Divider,
    icon: Icon,
    'icon-button': IconButton,
    image: Image,
    input: Input,
    'number-input': NumberInput,
    popover: Popover,
    progress: Progress,
    'radio-group': RadioGroup,
    select: Select,
    slider: Slider,
    spinner: Spinner,
    switch: Switch,
    text: Text,
    tooltip: Tooltip,
  },
  molecules: {
    accordion: Accordion,
    'alert-panel': AlertPanel,
    'dropdown-menu': DropdownMenu,
    form: Form,
    grid: Grid,
    list: List,
    'page-header': PageHeader,
    showcase: Showcase,
    stack: Stack,
    tabs: Tabs,
  },
  organisms: {
    'alert-dialog': AlertDialog,
    card: Card,
    modal: Modal,
  },
};
