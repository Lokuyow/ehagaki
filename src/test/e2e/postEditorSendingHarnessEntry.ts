import '../../app.css';
import '../../i18n';
import { mount } from 'svelte';
import PostEditorSendingHarness from './PostEditorSendingHarness.svelte';

const target = document.getElementById('app');

if (!target) {
    throw new Error('Harness mount target was not found.');
}

mount(PostEditorSendingHarness, { target });
