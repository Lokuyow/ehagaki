import '../../app.css';
import '../../i18n';
import { mount } from 'svelte';
import PostReactionHarness from './PostReactionHarness.svelte';
mount(PostReactionHarness, { target: document.getElementById('app')! });
