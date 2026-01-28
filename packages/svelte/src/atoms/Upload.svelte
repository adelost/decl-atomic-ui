<script lang="ts">
  import type { UploadAtom } from '@daui/core';
  import Icon from './Icon.svelte';

  let {
    id,
    label,
    accept,
    multiple = false,
    required,
    disabled = false,
    maxSize,
    placeholder = 'Drop files here or click to browse',
    sublabel,
    value: getValue,
    onChange,
  }: UploadAtom = $props();

  let fileInput: HTMLInputElement;
  let isDragging = $state(false);
  let files = $state<File[]>([]);

  // Sync with external value
  $effect(() => {
    const external = getValue?.();
    if (external === null) {
      files = [];
    } else if (external instanceof File) {
      files = [external];
    } else if (Array.isArray(external)) {
      files = external;
    }
  });

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    if (disabled) return;
    const droppedFiles = Array.from(e.dataTransfer?.files || []);
    const validFiles = filterFiles(droppedFiles);
    setFiles(multiple ? [...files, ...validFiles] : validFiles.slice(0, 1));
  }

  function filterFiles(fileList: File[]): File[] {
    let filtered = fileList;

    // Filter by accept types
    if (accept?.length) {
      filtered = filtered.filter((f) =>
        accept.some((a) => {
          if (a.startsWith('.')) {
            return f.name.toLowerCase().endsWith(a.toLowerCase());
          }
          // Handle MIME type patterns like 'image/*'
          const pattern = a.replace('*', '.*');
          return new RegExp(`^${pattern}$`).test(f.type);
        })
      );
    }

    // Filter by max size
    if (maxSize) {
      filtered = filtered.filter((f) => f.size <= maxSize);
    }

    return filtered;
  }

  function setFiles(newFiles: File[]) {
    files = newFiles.filter(Boolean);
    onChange?.(multiple ? files : files[0] || null);
  }

  function removeFile(index: number, e: MouseEvent) {
    e.stopPropagation();
    files = files.filter((_, i) => i !== index);
    onChange?.(multiple ? files : files[0] || null);
  }

  function handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const newFiles = filterFiles(Array.from(target.files || []));
    setFiles(multiple ? [...files, ...newFiles] : newFiles.slice(0, 1));
    target.value = ''; // Reset input
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave(e: DragEvent) {
    // Only set dragging false if we actually left the drop zone
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      isDragging = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  let acceptAttr = $derived(accept?.join(','));
</script>

<div class="upload-wrapper">
  {#if label}
    <label for={id} class="label">
      {label}
      {#if required}<span class="required">*</span>{/if}
    </label>
  {/if}

  <div
    class="drop-zone"
    class:dragging={isDragging}
    class:has-files={files.length > 0}
    class:disabled={disabled}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    onclick={() => !disabled && fileInput.click()}
    onkeydown={(e) => !disabled && handleKeydown(e)}
    role="button"
    tabindex={disabled ? -1 : 0}
    aria-label={placeholder}
    aria-disabled={disabled}
  >
    <input
      bind:this={fileInput}
      type="file"
      {id}
      name={id}
      accept={acceptAttr}
      {multiple}
      {disabled}
      class="file-input"
      onchange={handleInputChange}
    />

    {#if files.length > 0}
      <ul class="file-list">
        {#each files as file, i (`${file.name}-${file.size}-${file.lastModified}-${i}`)}
          <li class="file-item">
            <Icon name="file" size="sm" />
            <span class="file-name">{file.name}</span>
            <span class="file-size">{formatSize(file.size)}</span>
            {#if !disabled}
              <button
                type="button"
                class="remove-btn"
                onclick={(e) => removeFile(i, e)}
                aria-label="Remove file"
              >
                <Icon name="x" size="xs" />
              </button>
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <div class="empty-state">
        <Icon name="upload" size="lg" />
        <span class="placeholder">{placeholder}</span>
        {#if sublabel}
          <span class="sublabel">{sublabel}</span>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .upload-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    width: 100%;
  }

  .label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #0f172a;
  }

  .required {
    color: #ef4444;
    margin-left: 0.125rem;
  }

  .drop-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 8rem;
    padding: 1.5rem;
    background-color: #f8fafc;
    border: 2px dashed #e2e8f0;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .drop-zone:hover {
    border-color: #94a3b8;
    background-color: #f1f5f9;
  }

  .drop-zone:focus-visible {
    outline: none;
    border-color: #0f172a;
    box-shadow: 0 0 0 2px #0f172a;
  }

  .drop-zone.dragging {
    border-color: #0f172a;
    background-color: #e2e8f0;
  }

  .drop-zone.has-files {
    align-items: stretch;
    padding: 0.75rem;
  }

  .drop-zone.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f1f5f9;
  }

  .drop-zone.disabled:hover {
    border-color: #e2e8f0;
    background-color: #f1f5f9;
  }

  .file-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: #64748b;
  }

  .placeholder {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .sublabel {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  .file-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .file-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
  }

  .file-name {
    flex: 1;
    font-size: 0.875rem;
    color: #0f172a;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-size {
    font-size: 0.75rem;
    color: #64748b;
    flex-shrink: 0;
  }

  .remove-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    padding: 0;
    background: none;
    border: none;
    border-radius: 0.25rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s;
  }

  .remove-btn:hover {
    color: #ef4444;
    background-color: #fef2f2;
  }
</style>
